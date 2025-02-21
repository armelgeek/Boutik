import { promises as fs } from 'fs';
import path from 'path';
import * as readline from 'readline';

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface CrudConfig {
    name: string;
    fields: Field[];
    generateApi: boolean;
    generatePage: boolean;
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
    const schemaContent = `import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const ${config.name.toLowerCase()} = pgTable(
    '${config.name.toLowerCase()}',
    {
        id: uuid('id').primaryKey().default(sql\`gen_random_uuid()\`),
${config.fields.map(field => {
        let fieldType = '';
        switch (field.type) {
            case 'string':
                fieldType = 'varchar';
                break;
            case 'text':
                fieldType = 'text';
                break;
            case 'number':
                fieldType = 'integer';
                break;
            case 'boolean':
                fieldType = 'boolean';
                break;
            default:
                fieldType = 'varchar';
        }
        return `        ${field.name}: ${fieldType}('${field.name}')${field.required ? '.notNull()' : ''},`;
    }).join('\n')}
        created_at: timestamp('created_at').notNull().defaultNow(),
        updated_at: timestamp('updated_at').notNull().defaultNow(),
    }
);

export type ${config.name} = typeof ${config.name.toLowerCase()}.$inferSelect;
export type Insert${config.name} = typeof ${config.name.toLowerCase()}.$inferInsert;`;

    await fs.writeFile(
        path.join('drizzle/schema', `${config.name.toLowerCase()}.ts`),
        schemaContent,
        'utf-8'
    );
}

async function generateParams(config: CrudConfig) {
    const paramContent = `import { z } from 'zod';

export const Create${config.name}Params = z.object({
${config.fields.map(field => {
        let zodType = '';
        switch (field.type) {
            case 'string':
            case 'text':
                zodType = 'string()';
                break;
            case 'number':
                zodType = 'number()';
                break;
            case 'boolean':
                zodType = 'boolean()';
                break;
            default:
                zodType = 'string()';
        }
        return `    ${field.name}: z.${zodType}${field.required ? '' : '.optional()'},`;
    }).join('\n')}
});

export const Update${config.name}Params = Create${config.name}Params.partial();

export type Create${config.name}Params = z.infer<typeof Create${config.name}Params>;
export type Update${config.name}Params = z.infer<typeof Update${config.name}Params>;`;

    await fs.writeFile(
        path.join('core/domain/params', `${config.name.toLowerCase()}.param.ts`),
        paramContent,
        'utf-8'
    );
}

async function generateApiEndpoint(config: CrudConfig) {
    const apiContent = `import { db } from "@/drizzle/db";
import { ${config.name.toLowerCase()} } from "@/drizzle/schema/${config.name.toLowerCase()}";
import { Create${config.name}Params, Update${config.name}Params } from "@/core/domain/params/${config.name.toLowerCase()}.param";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const items = await db.select().from(${config.name.toLowerCase()});
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const params = Create${config.name}Params.parse(body);
        
        const [item] = await db.insert(${config.name.toLowerCase()})
            .values(params)
            .returning();
            
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...params } = Update${config.name}Params.parse(body);
        
        const [updated] = await db.update(${config.name.toLowerCase()})
            .set({ ...params, updated_at: new Date() })
            .where(eq(${config.name.toLowerCase()}.id, id))
            .returning();
            
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        
        await db.delete(${config.name.toLowerCase()})
            .where(eq(${config.name.toLowerCase()}.id, id));
            
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}`;

    const apiDir = path.join('app/api/v1', config.name.toLowerCase());
    await fs.mkdir(apiDir, { recursive: true });
    await fs.writeFile(
        path.join(apiDir, 'route.ts'),
        apiContent,
        'utf-8'
    );
}

async function generateAdminPage(config: CrudConfig) {
    const pageContent = `'use client';

import { Button } from "@/shared/components/atoms/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/atoms/table";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const { data: items = [] } = useQuery({
        queryKey: ['${config.name.toLowerCase()}'],
        queryFn: async () => {
            const response = await fetch('/api/v1/${config.name.toLowerCase()}');
            return response.json();
        },
    });

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">${config.name}</h1>
                <Link href={\`/d/${config.name.toLowerCase()}/new\`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add ${config.name}
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
${config.fields.map(field => 
        `                            <TableHead>${field.name}</TableHead>`
    ).join('\n')}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
${config.fields.map(field => 
        `                                <TableCell>{item.${field.name}}</TableCell>`
    ).join('\n')}
                                <TableCell className="text-right">
                                    <Link href={\`/d/${config.name.toLowerCase()}/\${item.id}\`}>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}`;

    const pageDir = path.join('app/(admin)/d', config.name.toLowerCase());
    await fs.mkdir(pageDir, { recursive: true });
    await fs.writeFile(
        path.join(pageDir, 'page.tsx'),
        pageContent,
        'utf-8'
    );
}

async function generateCrud() {
    try {
        console.log('🚀 CRUD Generator');
        console.log('----------------');

        const name = await question('Enter model name (PascalCase, ex: Product): ');
        
        const fields: Field[] = [];
        let addMoreFields = true;

        while (addMoreFields) {
            const fieldName = await question('Enter field name (or "done" to finish): ');
            if (fieldName.toLowerCase() === 'done') {
                addMoreFields = false;
                continue;
            }

            const fieldType = await question('Enter field type (string/text/number/boolean): ');
            const isRequired = (await question('Is field required? (y/n): ')).toLowerCase() === 'y';

            fields.push({
                name: fieldName,
                type: fieldType,
                required: isRequired
            });
        }

        const generateApi = (await question('Generate API endpoints? (y/n): ')).toLowerCase() === 'y';
        const generatePage = (await question('Generate admin page? (y/n): ')).toLowerCase() === 'y';

        const config: CrudConfig = {
            name,
            fields,
            generateApi,
            generatePage
        };

        console.log('\nGenerating files...');

        // Generate Drizzle schema
        await generateDrizzleSchema(config);
        console.log('✅ Generated Drizzle schema');

        // Generate params
        await generateParams(config);
        console.log('✅ Generated params');

        if (generateApi) {
            await generateApiEndpoint(config);
            console.log('✅ Generated API endpoints');
        }

        if (generatePage) {
            await generateAdminPage(config);
            console.log('✅ Generated admin page');
        }

        console.log('\n🎉 CRUD generation complete!');
        console.log('\nNext steps:');
        console.log('1. Run "npm run db:generate" to generate migrations');
        console.log('2. Run "npm run db:migrate" to apply migrations');
        if (generateApi) {
            console.log('3. API endpoints available at: /api/v1/' + name.toLowerCase());
        }
        if (generatePage) {
            console.log('4. Admin page available at: /d/' + name.toLowerCase());
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

generateCrud();
