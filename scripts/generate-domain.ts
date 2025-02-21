import { promises as fs } from 'fs';
import path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

interface UseCaseConfig {
    name: string;
    methodName: string;
    params: string[];
    returnType: string;
}

async function generateRepository(name: string, useCases: UseCaseConfig[]) {
    const content = `import type { ${name}, ${name}Payload, Paginated${name} } from '@/core/domain/types/${name.toLowerCase()}.type';
import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import type { Filter } from '@/shared/lib/types/filter';

export interface ${name}Repository {
${useCases.map(useCase => `    ${useCase.methodName}(${useCase.params.join(', ')}): Promise<${useCase.returnType}>;`).join('\n')}
}

export class ${name}RepositoryImpl implements ${name}Repository {
${useCases.map(useCase => `    async ${useCase.methodName}(${useCase.params.join(', ')}): Promise<${useCase.returnType}> {
        const endpoint = API_ENDPOINTS.${name.toLowerCase()}.${useCase.methodName};

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: '${useCase.methodName.startsWith('get') || useCase.methodName === 'list' ? 'GET' : useCase.methodName.startsWith('create') ? 'POST' : useCase.methodName.startsWith('update') ? 'PUT' : 'DELETE'}',
                headers: {
                    'Content-Type': 'application/json',
                },
                ${useCase.params.some(p => p.includes('payload')) ? 'body: JSON.stringify(payload),' : ''}
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to ${useCase.methodName} ${name.toLowerCase()}');
        }
    }`).join('\n\n')}
}`;

    await fs.writeFile(
        path.join('core/application/repository', `${name.toLowerCase()}.repository.ts`),
        content,
        'utf-8'
    );
}

async function generateUseCase(name: string, useCase: UseCaseConfig) {
    const content = `import type { ${name}Repository } from '@/core/application/repository/${name.toLowerCase()}.repository';
import type { ${useCase.returnType} } from '@/core/domain/types/${name.toLowerCase()}.type';

export class ${useCase.methodName.charAt(0).toUpperCase() + useCase.methodName.slice(1)}${name}UseCase {
    constructor(private readonly repository: ${name}Repository) {}

    async execute(${useCase.params.join(', ')}): Promise<${useCase.returnType}> {
        return this.repository.${useCase.methodName}(${useCase.params.map(p => p.split(':')[0]).join(', ')});
    }
}`;

    const dir = path.join('core/application/use-cases', name.toLowerCase());
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
        path.join(dir, `${useCase.methodName}-${name.toLowerCase()}.use-case.ts`),
        content,
        'utf-8'
    );
}

async function generateService(name: string, useCases: UseCaseConfig[]) {
    const content = `import { ${name}RepositoryImpl } from '@/core/application/repository/${name.toLowerCase()}.repository';
${useCases.map(useCase => 
    `import { ${useCase.methodName.charAt(0).toUpperCase() + useCase.methodName.slice(1)}${name}UseCase } from '@/core/application/use-cases/${name.toLowerCase()}/${useCase.methodName}-${name.toLowerCase()}.use-case';`
).join('\n')}
import type { ${name}, ${name}Payload } from '@/core/domain/types/${name.toLowerCase()}.type';

export class ${name}Service {
    private repository: ${name}RepositoryImpl;
${useCases.map(useCase => 
    `    private ${useCase.methodName}${name}UseCase: ${useCase.methodName.charAt(0).toUpperCase() + useCase.methodName.slice(1)}${name}UseCase;`
).join('\n')}

    constructor() {
        this.repository = new ${name}RepositoryImpl();
${useCases.map(useCase => 
    `        this.${useCase.methodName}${name}UseCase = new ${useCase.methodName.charAt(0).toUpperCase() + useCase.methodName.slice(1)}${name}UseCase(this.repository);`
).join('\n')}
    }

${useCases.map(useCase => `    async ${useCase.methodName}(${useCase.params.join(', ')}): Promise<${useCase.returnType}> {
        return this.${useCase.methodName}${name}UseCase.execute(${useCase.params.map(p => p.split(':')[0]).join(', ')});
    }`).join('\n\n')}
}`;

    const dir = path.join('core/application/services', name.toLowerCase());
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
        path.join(dir, `${name.toLowerCase()}.service.ts`),
        content,
        'utf-8'
    );
}

async function generateHooks(name: string, useCases: UseCaseConfig[]) {
    const processedUseCases = useCases.map(useCase => ({
        ...useCase,
        methodNamePascal: useCase.methodName.charAt(0).toUpperCase() + useCase.methodName.slice(1),
        isQuery: useCase.methodName.startsWith('get') || useCase.methodName === 'list' || useCase.methodName === 'detail',
        hasParams: useCase.params.length > 0,
        paramNames: useCase.params.map(p => p.split(':')[0]).join(', '),
        params: useCase.params.join(', ')
    }));

    const content = `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Filter } from '@/shared/lib/types/filter';
import type { ${name}, ${name}Payload } from '@/core/domain/types/${name.toLowerCase()}.type';
import { ${name}Service } from '@/core/application/services/${name.toLowerCase()}/${name.toLowerCase()}.service';

const service = new ${name}Service();

${processedUseCases.map(useCase => {
    if (useCase.isQuery) {
        return `export function use${useCase.methodNamePascal}${name}(${useCase.params}) {
    return useQuery({
        queryKey: ['${name.toLowerCase()}', '${useCase.methodName}'${useCase.hasParams ? `, { ${useCase.paramNames} }` : ''}],
        queryFn: () => service.${useCase.methodName}(${useCase.paramNames})
    });
}`;
    } else {
        return `export function use${useCase.methodNamePascal}${name}() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (${useCase.params}) => service.${useCase.methodName}(${useCase.paramNames}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['${name.toLowerCase()}'] });
        }
    });
}`;
    }
}).join('\n\n')}`;

    const dir = path.join('core/application/hooks');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
        path.join(dir, `use-${name.toLowerCase()}.ts`),
        content,
        'utf-8'
    );
}

async function askForCustomUseCase(name: string): Promise<UseCaseConfig | null> {
    console.log('\nCreating a new use case:');
    const methodName = await question('Enter method name (or "done" to finish): ');
    
    if (methodName.toLowerCase() === 'done') {
        return null;
    }

    let params: string[] = [];
    let addMoreParams = true;

    while (addMoreParams) {
        const param = await question('Enter parameter (format: "name: type") or "done": ');
        if (param.toLowerCase() === 'done') {
            addMoreParams = false;
        } else {
            params.push(param);
        }
    }

    const returnType = await question('Enter return type: ');

    return {
        name,
        methodName,
        params,
        returnType
    };
}

async function generateDomain() {
    try {
        console.log('🚀 Domain Generator');
        console.log('----------------');

        const name = await question('Enter model name (PascalCase, ex: Product): ');
        
        const defaultUseCases: UseCaseConfig[] = [
            {
                name,
                methodName: 'list',
                params: ['filter: Filter'],
                returnType: `Paginated${name}`
            },
            {
                name,
                methodName: 'detail',
                params: ['slug: string'],
                returnType: name
            },
            {
                name,
                methodName: 'create',
                params: ['payload: CreatePayload'],
                returnType: name
            },
            {
                name,
                methodName: 'update',
                params: ['slug: string', 'payload: UpdatePayload'],
                returnType: '{ message: string }'
            },
            {
                name,
                methodName: 'delete',
                params: ['slug: string'],
                returnType: '{ message: string }'
            }
        ];

        console.log('\nDefault use cases:');
        defaultUseCases.forEach((useCase, index) => {
            console.log(`${index + 1}. ${useCase.methodName}`);
        });

        const selectedUseCases = (await question('Enter use case numbers to generate (comma-separated, or "none" for custom only): '))
            .toLowerCase();

        let useCases = selectedUseCases === 'none' 
            ? []
            : selectedUseCases.split(',')
                .map(num => defaultUseCases[parseInt(num.trim()) - 1])
                .filter(Boolean);

        console.log('\nNow you can add custom use cases:');
        
        let addingCustom = true;
        while (addingCustom) {
            const customUseCase = await askForCustomUseCase(name);
            if (customUseCase) {
                useCases.push(customUseCase);
            } else {
                addingCustom = false;
            }
        }

        if (useCases.length === 0) {
            console.log('No use cases selected. Exiting...');
            return;
        }

        console.log('\nGenerating files...');

        // Generate repository
        await generateRepository(name, useCases);
        console.log('✅ Generated repository');

        // Generate use cases
        for (const useCase of useCases) {
            await generateUseCase(name, useCase);
        }
        console.log('✅ Generated use cases');

        // Generate service
        await generateService(name, useCases);
        console.log('✅ Generated service');

        // Generate hooks
        await generateHooks(name, useCases);
        console.log('✅ Generated React Query hooks');

        console.log('\n🎉 Domain generation complete!');
        console.log('\nGenerated use cases:');
        useCases.forEach(useCase => {
            console.log(`- ${useCase.methodName}(${useCase.params.join(', ')}): ${useCase.returnType}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

generateDomain();
