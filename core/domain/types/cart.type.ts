import { StaticImageData } from 'next/image';

export type CartItemSize = {
    size: string;
    quantity: number;
};

export type CartItem = {
    id: string;
    sizes: Record<string, number>;
    name: string;
    price: number;
    image: StaticImageData;
};