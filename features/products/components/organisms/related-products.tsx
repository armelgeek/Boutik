"use client";
import Heading from '@/shared/components/atoms/heading';
import Products from '../molecules/products';
import ProductsSkeleton from '../molecules/products-skeleton';
import useRelatedProducts from '../../hooks/use-related-products';

const RelatedProducts = ({ category, subCategory }:{ category: string, subCategory: string}) => {
  const { data,isLoading } = useRelatedProducts({ category, subCategory });
  return (
    <div className="my-10">
      <Heading text1={'RELATED'} text2={'PRODUCTS'}/>
      {isLoading && <ProductsSkeleton count={4} />}
      {data && <Products products={data}/>}
      {(!data || data.length === 0) && (
        <div className="text-center text-gray-500 mt-5">
          Aucun produit disponible
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
