import OurPolicies from '@/features/home/atoms/our-policies';
import BestSeller from '@/features/products/components/organisms/best-seller';
import LatestCollection from '@/features/products/components/organisms/latest-collection';
import Hero from '@/shared/components/atoms/hero';
import NewsLetter from '@/shared/components/atoms/newsletter';

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
