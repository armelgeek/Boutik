import { Product } from '@/features/products/config/product.type';
import { useShop } from '../../hooks/use-shop';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProductInfo from '../../hooks/use-product-info';
import Rating from '@/components/ui/rating';

const ProductItem = ({ id, images, slug, name, description, price }: Partial<Product>) => {
  const { currency } = useShop();
  const {
    addToCart,
    size
  } = useProductInfo({
    productId: id
  });
  const imageSrc = images?.[0] || 'https://placehold.co/400';



  return (
    <Link
      href={`/product/${slug || ''}`}
      className="group soverflow-hidden block relative bg-white shadow-sm hover:shadow-md p-2 border transition-shadow duration-300"
    >
      <div className="relative w-full h-32 md:h-48 lg:h-56 overflow-hidden">
        <Image
          src={imageSrc}
          alt={name || 'Product image'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <p className="mt-2 text-gray-700 text-lg truncate">{name || 'Unnamed product'}</p>
          <p className="mt-1 font-semibold text-black text-xl">
            {currency}
            {price}
          </p>
        </div>

      </div>

      <div className='px-1 pt-2'>
        <Button
          onClick={() => addToCart(id, size)}
          variant='default'
          className='py-1 w-full text-white'
        >
          <ShoppingCart className="mr-2 w-5 h-5" />
          ADD TO CART
        </Button>

      </div>
    </Link>
  );
};

export default ProductItem;
