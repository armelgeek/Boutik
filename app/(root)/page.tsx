import OurPolicies from '@/features/home/atoms/our-policies';
import BestSeller from '@/features/products/components/organisms/best-seller';
import LatestCollection from '@/features/products/components/organisms/latest-collection';
import Hero from '@/shared/components/atoms/hero';
import NewsLetter from '@/shared/components/atoms/newsletter';
import { kAppName } from '@/shared/lib/constants/app.constant';
import type { Metadata } from 'next';
import { STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR } from 'next/dist/lib/constants';



export async function generateMetadata(): Promise<Metadata> {
 
  return {
    title: {
      template: `${kAppName} | %s`,
      default: `${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`,
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicies/>
      <NewsLetter/>
    </>
  );
}
