"use client";
import useBestSeller from '../hooks/use-best-seller';
import Heading from '@/shared/components/atoms/heading';
import Products from '../molecules/products';

const BestSeller = () => {
  const { data,isLoading } = useBestSeller();
  return (
    <div className="my-10">
        <Heading text1={'BEST'} text2={'SELLERS'}>
           Our best-selling products that our customers can not get enough of.
           Shop the most popular items from our store.
        </Heading>
      {isLoading && <p>Loading ...</p>}
      <Products products={data}/>
    </div>
  );
};

export default BestSeller;
