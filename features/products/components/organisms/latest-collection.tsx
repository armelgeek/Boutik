"use client";
import useLatest from '../../hooks/use-latest';
import Heading from '@/shared/components/atoms/heading';
import Products from '../molecules/products';
import ProductsSkeleton from '../molecules/products-skeleton';

const LatestCollection = () => {
  const { data, isLoading } = useLatest();
  return (
    <section className="my-16 px-2 md:px-0">
      <Heading text1={"Latest"} text2={"Collections"}>
        Discover our newest arrivals that blend style and comfort. Explore the latest trends in fashion, curated just for you.
      </Heading>
      <div className="mt-10">
        {isLoading ? (
          <ProductsSkeleton count={8} />
        ) : (
          <div className="animate-fade-in">
            <Products products={data} />
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestCollection;