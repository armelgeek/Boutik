import Collection from '@/features/products/components/organisms/collection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Generated by create next app',
};

export default function Page() {
  return (
    <>
        <Collection/>
    </>
  );
}
