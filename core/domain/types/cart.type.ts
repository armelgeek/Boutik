import { StaticImageData } from 'next/image';

export type CartItemSize = {
    size: string;
    quantity: number;
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image: StaticImageData;
    size: string;
    quantity: number;
};