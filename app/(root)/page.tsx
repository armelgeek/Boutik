import { Button } from '@/components/ui/button';
import DealCountdown from '@/components/ui/deal';
import OurPolicies from '@/features/home/atoms/our-policies';
import BestSeller from '@/features/products/components/organisms/best-seller';
import LatestCollection from '@/features/products/components/organisms/latest-collection';
import Hero from '@/shared/components/atoms/hero';
import Link from 'next/link';
export default function Home() {
  return (
    <>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <div className='flex justify-center items-center my-8'>
        <Button  className='px-8 py-4 font-semibold text-lg'>
          <Link className='font-normal text-white text-sm' href='/collection'>View All Products</Link>
        </Button>
      </div>
      <DealCountdown />
      <OurPolicies />
    </>
  );
}
