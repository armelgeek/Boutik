import { promises as fs } from 'fs';
import path from 'path';
import * as readline from 'readline';

interface Field {
    name: string;
    type: string;
    required: boolean;
    length?: number;
}

interface CrudConfig {
    name: string;
    fields: Field[];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function generateDrizzleSchema(config: CrudConfig) {
    const schemaContent = `import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';


export const ${config.name.toLowerCase()} = pgTable(
    '${config.name.toLowerCase()}',
    {
        ${config.name.toLowerCase()}Id: uuid('${config.name.toLowerCase()}_id')
            .primaryKey()
            .default(sql\`gen_random_uuid()\`),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
${config.fields.map(field => {
        let fieldType = '';
        switch (field.type) {
            case 'string':
                fieldType = `varchar('${field.name}', { length: ${field.length || 255} })`;
                break;
            case 'text':
                fieldType = `text('${field.name}')`;
                break;
            default:
                fieldType = `varchar('${field.name}', { length: ${field.length || 255} })`;
        }
        return `        ${field.name}: ${fieldType}${field.required ? '.notNull()' : ''},`;
    }).join('\n')}
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    }
);`;

    await fs.writeFile(
        path.join('drizzle/schema', `${config.name.toLowerCase()}.ts`),
        schemaContent,
        'utf-8'
    );
}

async function generateTypes(config: CrudConfig) {
    const typeContent = `import { z } from 'zod';

import { ${config.name}FormSchema, ${config.name}SelectSchema } from '@/core/domain/schema/${config.name.toLowerCase()}.schema';
import type { Pagination } from '@/shared/lib/types/pagination';

export type ${config.name} = z.infer<typeof ${config.name}SelectSchema>;

export type ${config.name}Payload = z.infer<typeof ${config.name}FormSchema>;

export interface Paginated${config.name} {
    data: ${config.name}[];
    meta: {
        pagination?: Pagination;
    };
}`;

    await fs.writeFile(
        path.join('core/domain/types', `${config.name.toLowerCase()}.type.ts`),
        typeContent,
        'utf-8'
    );
}

async function generateParams(config: CrudConfig) {
    const paramContent = `import {
    createLoader,
    createSerializer,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
} from 'nuqs/server';

export const ${config.name.toLowerCase()}SearchParams = {
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    sortBy: parseAsString.withDefault(''),
    sortDir: parseAsString.withDefault('')
};

export const loadSearchParams = createLoader(${config.name.toLowerCase()}SearchParams);
export const serializeSearchParams = createSerializer(${config.name.toLowerCase()}SearchParams);`;

    await fs.writeFile(
        path.join('core/domain/params', `${config.name.toLowerCase()}.param.ts`),
        paramContent,
        'utf-8'
    );
}

async function generateSchema(config: CrudConfig) {
    const schemaContent = `import { z } from 'zod';

export const ${config.name}SelectSchema = z.object({
    ${config.name.toLowerCase()}Id: z.string().uuid(),
    slug: z.string(),
${config.fields.map(field => {
        let zodType = 'string()';
        if (!field.required) {
            zodType += '.nullable()';
        }
        return `    ${field.name}: z.${zodType},`;
    }).join('\n')}
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const ${config.name}FormSchema = z.object({
    slug: z.string(),
${config.fields.map(field => {
        let zodType = 'string()';
        if (!field.required) {
            zodType += '.nullable()';
        }
        return `    ${field.name}: z.${zodType},`;
    }).join('\n')},
});`;

    await fs.writeFile(
        path.join('core/domain/schema', `${config.name.toLowerCase()}.schema.ts`),
        schemaContent,
        'utf-8'
    );
}

async function generateRepository(config: CrudConfig) {
    const repositoryContent = `import { serializeSearchParams } from '@/core/domain/params/${config.name.toLowerCase()}.param';
import type { ${config.name}, ${config.name}Payload, Paginated${config.name} } from '@/core/domain/types/${config.name.toLowerCase()}.type';
import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import type { Filter } from '@/shared/lib/types/filter';

export interface ${config.name}Repository {
    list(filter: Filter): Promise<Paginated${config.name}>;
    detail(slug: string): Promise<${config.name}>;
    create(payload: ${config.name}Payload): Promise<${config.name}>;
    update(slug: string, payload: ${config.name}Payload): Promise<{ message: string }>;
    delete(slug: string): Promise<{ message: string }>;
}

export class ${config.name}RepositoryImpl implements ${config.name}Repository {
    async list(filter: Filter): Promise<Paginated${config.name}> {
        const serialize = serializeSearchParams(filter);
        const endpoint = API_ENDPOINTS.${config.name.toLowerCase()}.list(serialize);

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to fetch ${config.name.toLowerCase()} list');
        }
    }

    async detail(slug: string): Promise<${config.name}> {
        const endpoint = API_ENDPOINTS.${config.name.toLowerCase()}.detail(slug);

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to fetch ${config.name.toLowerCase()} detail');
        }
    }

    async create(payload: ${config.name}Payload): Promise<${config.name}> {
        const endpoint = API_ENDPOINTS.${config.name.toLowerCase()}.create;

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to create ${config.name.toLowerCase()}');
        }
    }

    async update(slug: string, payload: ${config.name}Payload): Promise<{ message: string }> {
        const endpoint = API_ENDPOINTS.${config.name.toLowerCase()}.update(slug);

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to update ${config.name.toLowerCase()}');
        }
    }

    async delete(slug: string): Promise<{ message: string }> {
        const endpoint = API_ENDPOINTS.${config.name.toLowerCase()}.delete(slug);

        try {
            const response = await fetch(\`\${API_URL}\${endpoint}\`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        } catch (error) {
            throw new Error('Failed to delete ${config.name.toLowerCase()}');
        }
    }
}`;

    await fs.writeFile(
        path.join('core/application/repository', `${config.name.toLowerCase()}.repository.ts`),
        repositoryContent,
        'utf-8'
    );
}

async function generateUseCases(config: CrudConfig) {
    const useCases = ['create', 'delete', 'get', 'update'];
    const baseDir = path.join('core/application/use-cases', config.name.toLowerCase());
    await fs.mkdir(baseDir, { recursive: true });

    for (const useCase of useCases) {
        const useCaseContent = `import type { ${config.name}Repository } from '@/core/application/repository/${config.name.toLowerCase()}.repository';
import type { ${useCase === 'create' ? `${config.name}Payload` : useCase === 'get' ? `${config.name}` : '{ message: string }'} } from '@/core/domain/types/${config.name.toLowerCase()}.type';

export class ${useCase.charAt(0).toUpperCase() + useCase.slice(1)}${config.name}UseCase {
    constructor(private readonly repository: ${config.name}Repository) {}

    async execute(${useCase === 'create' ? `payload: ${config.name}Payload` : 'slug: string' + (useCase === 'update' ? `, payload: ${config.name}Payload` : '')}): Promise<${useCase === 'create' ? `${config.name}` : useCase === 'get' ? `${config.name}` : '{ message: string }'}> {
        return this.repository.${useCase}(${useCase === 'create' ? 'payload' : 'slug' + (useCase === 'update' ? ', payload' : '')});
    }
}`;

        await fs.writeFile(
            path.join(baseDir, `${useCase}-${config.name.toLowerCase()}.use-case.ts`),
            useCaseContent,
            'utf-8'
        );
    }
}

async function generateService(config: CrudConfig) {
    const serviceContent = `import { ${config.name}RepositoryImpl } from '@/core/application/repository/${config.name.toLowerCase()}.repository';
import { Create${config.name}UseCase } from '@/core/application/use-cases/${config.name.toLowerCase()}/create-${config.name.toLowerCase()}.use-case';
import { Delete${config.name}UseCase } from '@/core/application/use-cases/${config.name.toLowerCase()}/delete-${config.name.toLowerCase()}.use-case';
import { Get${config.name}UseCase } from '@/core/application/use-cases/${config.name.toLowerCase()}/get-${config.name.toLowerCase()}.use-case';
import { Update${config.name}UseCase } from '@/core/application/use-cases/${config.name.toLowerCase()}/update-${config.name.toLowerCase()}.use-case';
import type { ${config.name}, ${config.name}Payload } from '@/core/domain/types/${config.name.toLowerCase()}.type';

export class ${config.name}Service {
    private repository: ${config.name}RepositoryImpl;
    private create${config.name}UseCase: Create${config.name}UseCase;
    private delete${config.name}UseCase: Delete${config.name}UseCase;
    private get${config.name}UseCase: Get${config.name}UseCase;
    private update${config.name}UseCase: Update${config.name}UseCase;

    constructor() {
        this.repository = new ${config.name}RepositoryImpl();
        this.create${config.name}UseCase = new Create${config.name}UseCase(this.repository);
        this.delete${config.name}UseCase = new Delete${config.name}UseCase(this.repository);
        this.get${config.name}UseCase = new Get${config.name}UseCase(this.repository);
        this.update${config.name}UseCase = new Update${config.name}UseCase(this.repository);
    }

    async create(payload: ${config.name}Payload): Promise<${config.name}> {
        return this.create${config.name}UseCase.execute(payload);
    }

    async delete(slug: string): Promise<{ message: string }> {
        return this.delete${config.name}UseCase.execute(slug);
    }

    async get(slug: string): Promise<${config.name}> {
        return this.get${config.name}UseCase.execute(slug);
    }

    async update(slug: string, payload: ${config.name}Payload): Promise<{ message: string }> {
        return this.update${config.name}UseCase.execute(slug, payload);
    }
}`;

    const serviceDir = path.join('core/application/services', config.name.toLowerCase());
    await fs.mkdir(serviceDir, { recursive: true });
    await fs.writeFile(
        path.join(serviceDir, `${config.name.toLowerCase()}.service.ts`),
        serviceContent,
        'utf-8'
    );
}

async function generateCrud() {
    try {
        console.log('🚀 CRUD Generator');
        console.log('----------------');

        const name = await question('Enter model name (PascalCase, ex: Brand): ');
        
        const fields: Field[] = [];
        let addMoreFields = true;

        while (addMoreFields) {
            const fieldName = await question('Enter field name (or "done" to finish): ');
            if (fieldName.toLowerCase() === 'done') {
                addMoreFields = false;
                continue;
            }

            const fieldType = await question('Enter field type (string/text): ');
            const isRequired = (await question('Is field required? (y/n): ')).toLowerCase() === 'y';
            const length = fieldType === 'string' ? parseInt(await question('Enter field length (default: 255): ') || '255') : undefined;

            fields.push({
                name: fieldName,
                type: fieldType,
                required: isRequired,
                length
            });
        }

        const config: CrudConfig = {
            name,
            fields
        };

        console.log('\nGenerating files...');

        // Create necessary directories
        const dirs = [
            'core/domain/types',
            'core/domain/params',
            'core/domain/schema',
            'core/application/repository',
            'core/application/use-cases',
            'core/application/services',
            'features',
            'drizzle/schema'
        ];

        for (const dir of dirs) {
            await fs.mkdir(dir, { recursive: true });
        }

        // Generate all files
        await generateDrizzleSchema(config);
        console.log('✅ Generated Drizzle schema');

        await generateTypes(config);
        console.log('✅ Generated types');

        await generateParams(config);
        console.log('✅ Generated params');

        await generateSchema(config);
        console.log('✅ Generated schema');

        await generateRepository(config);
        console.log('✅ Generated repository');

        await generateUseCases(config);
        console.log('✅ Generated use cases');

        await generateService(config);
        console.log('✅ Generated service');

        console.log('\n🎉 CRUD generation complete!');
        console.log('\nNext steps:');
        console.log('1. Add API endpoints to API_ENDPOINTS in shared/lib/config/api.ts');
        console.log('2. Run "npm run db:generate" to generate migrations');
        console.log('3. Run "npm run db:migrate" to apply migrations');
        console.log('4. Create API routes in app/api/v1/' + name.toLowerCase());
        console.log('5. Create admin pages in app/(admin)/d/' + name.toLowerCase());

    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

generateCrud();
