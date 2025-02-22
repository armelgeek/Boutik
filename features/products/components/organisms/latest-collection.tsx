"use client";
import useLatest from '../../hooks/use-latest';
import Heading from '@/shared/components/atoms/heading';
import Products from '../molecules/products';
import ProductsSkeleton from '../molecules/products-skeleton';

const LatestCollection = () => {
  const { data,isLoading } = useLatest();
  return (
    <div className="my-10">
        <Heading text1={'LATEST'} text2={'COLLECTIONS'}>
             Discover our newest arrivals that blend style and comfort. Explore the
          latest trends in fashion, curated just for you.
        </Heading>
      {isLoading && <ProductsSkeleton count={8} />}
      <Products products={data}/>
    </div>
  );
};

export default LatestCollection;
