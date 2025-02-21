import { promises as fs } from 'fs';
import path from 'path';

const DRIZZLE_SCHEMA_DIR = '../drizzle/schema';
const DOMAIN_DIR = '../core/domain';

interface SchemaInfo {
    name: string;
    fields: string[];
}

async function generateKeyFile(name: string) {
    const keyContent = `export const ${name}Key = {
    all: ['${name}'] as const,
    detail: (id: string) => [...${name}Key.all, id] as const,
    lists: () => [...${name}Key.all, 'list'] as const,
} as const;`;

    await fs.writeFile(
        path.join(DOMAIN_DIR, 'keys', `${name.toLowerCase()}.key.ts`),
        keyContent,
        'utf-8'
    );
}

async function generateParamFile(name: string) {
    const paramContent = `import { z } from 'zod';

export const Create${name}Params = z.object({
    name: z.string(),
    description: z.string().optional(),
});

export const Update${name}Params = Create${name}Params.partial();

export type Create${name}Params = z.infer<typeof Create${name}Params>;
export type Update${name}Params = z.infer<typeof Update${name}Params>;`;

    await fs.writeFile(
        path.join(DOMAIN_DIR, 'params', `${name.toLowerCase()}.param.ts`),
        paramContent,
        'utf-8'
    );
}

async function ensureDirectories() {
    const dirs = [
        path.join(DOMAIN_DIR, 'keys'),
        path.join(DOMAIN_DIR, 'params'),
    ];

    for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function main() {
    try {
        await ensureDirectories();
        
        // Generate for each schema
        const schemas = ['categories', 'products']; // Add more schemas as needed
        for (const schema of schemas) {
            const name = schema.charAt(0).toUpperCase() + schema.slice(1, -1); // Convert 'categories' to 'Category'
            await generateKeyFile(name);
            await generateParamFile(name);
            console.log(`Generated files for ${name}`);
        }
    } catch (error) {
        console.error('Error generating files:', error);
    }
}

main();
