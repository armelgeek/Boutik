'use client';
import { CartItem as CartItemType } from '@/core/domain/types/cart.type';
import { useShop } from '@/features/products/hooks/use-shop';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { currency, updateQuantity } = useShop();

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-4">
        <Image
          src={item.image}
          width={60}
          height={60}
          alt={item.name}
          className="object-cover"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">Size: {item.size}</p>
          <p className="text-sm">
            {currency}
            {item.price * item.quantity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
            className="w-8 h-8 flex items-center justify-center border"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
