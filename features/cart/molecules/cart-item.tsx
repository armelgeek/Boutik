'use client';
import { DisplayCartItem } from '../hooks/use-sorted-cart';
import { useShop } from '@/features/products/hooks/use-shop';
import Image from 'next/image';

interface CartItemProps {
  item: DisplayCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { currency, updateQuantity,removeFromCart } = useShop();
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-4">
        <img
          src={item.image || 'https://placehold.co/400'}
          width={60}
          height={60}
          alt={item.name}
          className="object-cover"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <div className="text-sm text-gray-500">
            <p>Size: {item.size}</p>
            <p>Price: {currency}{Number(item.price).toFixed(2)}</p>
          </div>
          <p className="text-sm font-medium">
            Total: {currency}{(Number(item.price) * Number(item.quantity)).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
            className="w-8 h-8 flex items-center justify-center border hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id, item.size)}
          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded"
          title="Remove from cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
