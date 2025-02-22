import { promises as fs } from 'fs';
import path from 'path';
import * as readline from 'readline';
import { faker } from '@faker-js/faker';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

interface FieldConfig {
    name: string;
    type: string;
    isArray?: boolean;
    length?: number;
    required?: boolean;
    fakerType?: string;
}

interface MockConfig {
    name: string;
    fields: FieldConfig[];
}

function generateMockValue(field: FieldConfig): any {
    if (field.fakerType) {
        const [category, method] = field.fakerType.split('.');
        return faker[category][method]();
    }

    switch (field.type.toLowerCase()) {
        case 'string':
            if (field.name.includes('email')) return faker.internet.email();
            if (field.name.includes('name')) return faker.person.fullName();
            if (field.name.includes('phone')) return faker.phone.number();
            if (field.name.includes('address')) return faker.location.streetAddress();
            if (field.name.includes('image') || field.name.includes('photo')) return faker.image.url();
            if (field.name.includes('description')) return faker.lorem.paragraph();
            if (field.name.includes('title')) return faker.lorem.sentence();
            if (field.name.includes('color')) return faker.color.human();
            if (field.name.includes('url')) return faker.internet.url();
            if (field.name.includes('password')) return faker.internet.password();
            if (field.name.includes('date')) return faker.date.recent().toISOString();
            return faker.lorem.word();
            
        case 'number':
            if (field.name.includes('price') || field.name.includes('amount')) 
                return Number(faker.commerce.price());
            if (field.name.includes('age')) 
                return faker.number.int({ min: 18, max: 80 });
            if (field.name.includes('rating')) 
                return faker.number.float({ min: 0, max: 5, precision: 0.1 });
            return faker.number.int({ min: 0, max: 1000 });
            
        case 'boolean':
            return faker.datatype.boolean();
            
        case 'date':
            return faker.date.recent().toISOString();
            
        case 'uuid':
            return faker.string.uuid();
            
        default:
            return faker.lorem.word();
    }
}

function generateMockData(config: MockConfig, count: number = 1): any[] {
    return Array.from({ length: count }, () => {
        const mock = {};
        for (const field of config.fields) {
            if (field.isArray) {
                mock[field.name] = Array.from(
                    { length: faker.number.int({ min: 1, max: 5 }) },
                    () => generateMockValue(field)
                );
            } else {
                mock[field.name] = generateMockValue(field);
            }
        }
        return mock;
    });
}

async function generateMockFile(config: MockConfig, count: number) {
    const mockData = generateMockData(config, count);
    
    const content = `import { ${config.name} } from '@/core/domain/types/${config.name.toLowerCase()}.type';

export const mock${config.name}s: ${config.name}[] = ${JSON.stringify(mockData, null, 2)};

export function getMock${config.name}(index: number = 0): ${config.name} {
    return mock${config.name}s[index % mock${config.name}s.length];
}

export function generateMock${config.name}(): ${config.name} {
    return ${JSON.stringify(generateMockData(config, 1)[0], null, 2)};
}`;

    const dir = path.join('core/domain/mocks');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
        path.join(dir, `${config.name.toLowerCase()}.mock.ts`),
        content,
        'utf-8'
    );
}

async function suggestFakerType(fieldName: string, fieldType: string): Promise<string> {
    console.log('\nSuggested faker types for', fieldName, ':');
    
    const suggestions = [];
    if (fieldName.includes('name')) suggestions.push('person.fullName');
    if (fieldName.includes('email')) suggestions.push('internet.email');
    if (fieldName.includes('phone')) suggestions.push('phone.number');
    if (fieldName.includes('address')) suggestions.push('location.streetAddress');
    if (fieldName.includes('image')) suggestions.push('image.url');
    if (fieldName.includes('price')) suggestions.push('commerce.price');
    if (fieldName.includes('description')) suggestions.push('lorem.paragraph');
    if (fieldName.includes('company')) suggestions.push('company.name');
    if (fieldName.includes('date')) suggestions.push('date.recent');

    if (suggestions.length > 0) {
        console.log('Suggestions:');
        suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
    }
    
    console.log('\nOther common categories:');
    console.log('- person.*: firstName, lastName, jobTitle');
    console.log('- internet.*: userName, url, password');
    console.log('- commerce.*: productName, price, department');
    console.log('- company.*: name, catchPhrase, buzzPhrase');
    console.log('- location.*: city, country, zipCode');
    
    const fakerType = await question('Enter faker type (or press enter to skip): ');
    return fakerType.trim();
}

async function generateMock() {
    try {
        console.log('🚀 Mock Data Generator');
        console.log('-------------------');

        const name = await question('Enter model name (PascalCase, ex: Product): ');
        const count = parseInt(await question('How many mock items to generate? '), 10) || 5;

        const fields: FieldConfig[] = [];
        let addingFields = true;

        while (addingFields) {
            console.log('\nAdding a new field:');
            const fieldName = await question('Enter field name (or "done" to finish): ');
            
            if (fieldName.toLowerCase() === 'done') {
                addingFields = false;
                continue;
            }

            const fieldType = await question('Enter field type (string/number/boolean/date/uuid): ');
            const isArray = (await question('Is this field an array? (y/N): ')).toLowerCase() === 'y';
            const required = (await question('Is this field required? (Y/n): ')).toLowerCase() !== 'n';
            
            const fakerType = await suggestFakerType(fieldName, fieldType);

            fields.push({
                name: fieldName,
                type: fieldType,
                isArray,
                required,
                fakerType: fakerType || undefined
            });
        }

        const config: MockConfig = {
            name,
            fields
        };

        console.log('\nGenerating mock data...');
        await generateMockFile(config, count);
        
        console.log('\n✅ Generated mock data file at core/domain/mocks/${name.toLowerCase()}.mock.ts');
        console.log('\nExample usage:');
        console.log(\`import { mock\${name}s, getMock\${name}, generateMock\${name} } from '@/core/domain/mocks/\${name.toLowerCase()}.mock';

// Get all mock \${name.toLowerCase()}s
console.log(mock\${name}s);

// Get a specific mock \${name.toLowerCase()}
console.log(getMock\${name}(0));

// Generate a new random mock \${name.toLowerCase()}
console.log(generateMock\${name}());\`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

generateMock();
