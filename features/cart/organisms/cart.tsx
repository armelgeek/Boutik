'use client';
import { useShop } from '@/features/products/hooks/use-shop';
import Heading from '@/shared/components/atoms/heading';
import React from 'react';
import useSortedCart from '../hooks/use-sorted-cart';
import CartTotal from '../molecules/cart-total';
import { useRouter } from 'next/navigation';
import CartList from '../molecules/cart-list';

const Cart = () => {
    const router = useRouter();
    const { cartItems, addOrder } = useShop();
    const cartData = useSortedCart(cartItems);

    return (
        <div className="pt-14 border-t">
            <div className="mb-8">
                <Heading text1={'YOUR'} text2={'CART'} className='text-left' />
            </div>

            <CartList items={cartData} />
            {cartData && cartData.length > 0 && (
                <div className='flex flex-col justify-end items-end'>
                    <CartTotal />
                    <div className="w-full text-end">
                        <button
                            onClick={() => {
                                addOrder();
                                router.push('/place-order');
                            }}
                            className="my-8 px-8 py-3 bg-black text-white text-sm"
                        >
                            PROCEED TO CHECKOUT
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Cart;