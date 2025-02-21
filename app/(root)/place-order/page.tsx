import PlaceOrder from '@/features/cart/organisms/place-orders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Generated by create next app',
};

export default function Page() {
  return (
    <>
        <PlaceOrder/>    
    </>
  );
}
