
import { Product } from '@/core/domain/types/product.type';
import { useShop } from '../hooks/use-shop';
import Link from 'next/link';
import Image from 'next/image';

const ProductItem = ({ id, images, name, price }: Product) => {
  const { currency } = useShop();

  return (
    <Link href={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden border p-4 shadow-sm  h-[300px]">
       {images.length > 0 && (
        <Image
          src={images[0]}
          alt={name || '<no name>'}
          className="w-full h-48 object-cover mb-2  hover:scale-110 transition ease-in-out duration-500"
        />
       )}
        <p className="pt-3 pb-1 text-sm ">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
};
export default ProductItem;
