import { Product } from "./product.type";

export type Order = {
    id: number;
    total: number;
    status: string;
    invoiceUrl: string;
    created_at: string;
    updated_at: string;
    items: Array<{
        id: number;
        size: string;
        quantity: number;
        product: Product;
    }>; 
};