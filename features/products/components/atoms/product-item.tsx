import { Product } from '@/features/products/config/product.type';
import { useShop } from '../../hooks/use-shop';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProductInfo from '../../hooks/use-product-info';

interface ProductItemProps extends Partial<Product> {
  categoryName?: string;
  subCategoryName?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
  };
  subcategory?: Array<{
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
  }>;
}

const ProductItem = ({ 
  id, 
  images, 
  slug, 
  name, 
  price, 
  sizes,
  category_id,
  sub_category_id,
  categoryName, 
  subCategoryName,
  category,
  subcategory
}: ProductItemProps) => {
  const { currency } = useShop();
  const { addToCart, size: selectedSize, setSize: setSelectedSize } = useProductInfo({ productId: id });

  let imageSrc = 'https://placehold.co/400';
  if (images) {
    if (Array.isArray(images)) {
      imageSrc = images[0] || imageSrc;
    } else if (typeof images === 'string') {
      imageSrc = (images as string).split(',')[0] || imageSrc;
    }
  }

  const getCategoryName = (categoryId?: string) => {
    if (categoryName) return categoryName;
    if (category?.name) return category.name;
    
    const categories: Record<string, string> = {
      'men': 'Men',
      'women': 'Women', 
      'kids': 'Kids',
      'accessories': 'Accessories',
      'shoes': 'Shoes'
    };
    return categoryId ? categories[categoryId] : undefined;
  };

  const getSubCategoryName = (subCategoryId?: string) => {
    if (subCategoryName) return subCategoryName;
    
    if (subcategory && subcategory.length > 1) {
      const subCat = subcategory.find(cat => cat.id !== category?.id && cat.parentId);
      if (subCat) return subCat.name;
    }
    
    const subCategories: Record<string, string> = {
      'shirts': 'Shirts',
      'pants': 'Pants',
      'dresses': 'Dresses',
      'tops': 'Tops',
      'sneakers': 'Sneakers',
      'boots': 'Boots',
      'bags': 'Bags',
      'watches': 'Watches'
    };
    return subCategoryId ? subCategories[subCategoryId] : undefined;
  };

  const displayCategoryName = getCategoryName(category_id || undefined);
  const displaySubCategoryName = getSubCategoryName(sub_category_id || undefined);

  const availableSizes = sizes && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'];

  if (!selectedSize && availableSizes.length > 0) {
    setSelectedSize(availableSizes[0]);
  }

  const hasDiscount = true;
  const discount = hasDiscount ? 30 : null;
  const originalPrice = hasDiscount && price ? Math.round(price / 0.7) : null;
  
  const rating = id ? 3.8 + (parseInt(id.slice(-2), 16) % 11) * 0.1 : 4.2;
  const reviewCount = id ? 12 + (parseInt(id.slice(-3), 16) % 250) * 10 : 206;

  return (
    <div className="group relative bg-white  shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md">
            save {discount}%
          </span>
        </div>
      )}

      <Link href={`/product/${slug || ''}`} className="block relative w-full h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={name || 'Product image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>

      <div className="p-4">
        <Link href={`/product/${slug || ''}`} className="block">
          <h3 title={name} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors duration-200">
            {(name || 'Unnamed product').length > 20 
              ? `${(name || 'Unnamed product').substring(0, 20)}...` 
              : (name || 'Unnamed product')
            }
          </h3>
        </Link>

        {(displayCategoryName || displaySubCategoryName) && (
          <div className="flex items-center gap-2 mb-3">
            {displayCategoryName && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                <Tag className="w-3 h-3" />
                {displayCategoryName}
              </span>
            )}
            {displaySubCategoryName && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md">
                <Tag className="w-3 h-3" />
                {displaySubCategoryName}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            {currency} {price?.toLocaleString()}
          </span>
          {originalPrice && originalPrice !== price && (
            <span className="text-sm text-gray-400 line-through">
              {currency} {originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            {reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount} reviews
          </span>
        </div>

        {availableSizes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-medium text-gray-700">Size</span>
            </div>
            <div className="flex items-center gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-orange-400 bg-orange-400 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(id, selectedSize || availableSizes[0]);
            }}
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Add to cart
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="p-2.5 border-gray-200 hover:bg-gray-50 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="p-2.5 border-gray-200 hover:bg-gray-50 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
