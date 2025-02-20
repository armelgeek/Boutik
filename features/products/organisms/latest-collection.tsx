"use client";
import useLatest from '../hooks/use-latest';
import Heading from '@/shared/components/atoms/heading';
import Products from '../molecules/products';

const LatestCollection = () => {
  const { data,isLoading } = useLatest();
  return (
    <div className="my-10">
        <Heading text1={'LATEST'} text2={'COLLECTIONS'}>
             Discover our newest arrivals that blend style and comfort. Explore the
          latest trends in fashion, curated just for you.
        </Heading>
      {isLoading && <p>Loading ...</p>}
      <Products products={data}/>
    </div>
  );
};

export default LatestCollection;
