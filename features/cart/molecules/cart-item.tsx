'use client';
import { DisplayCartItem } from '../hooks/use-sorted-cart';
import { useShop } from '@/features/products/hooks/use-shop';
interface CartItemProps {
  item: DisplayCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { currency, updateQuantity,removeFromCart } = useShop();
  return (
    <div className="flex justify-between items-center py-4 border-b">
      <div className="flex gap-4">
        <img
          src={item.image || 'https://placehold.co/400'}
          width={120}
          height={120}
          alt={item.name}
          className="object-cover"
        />
        <div className='flex flex-col gap-1'>
          <p className="mb-2 font-medium">{item.name}</p>
          <div className="text-gray-500 text-sm">
            <p>Size: {item.size}</p>
            <p>Price: {currency}{Number(item.price).toFixed(2)}</p>
          </div>
          <p className="font-medium text-sm">
            Total: {currency}{(Number(item.price) * Number(item.quantity)).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
            className="flex justify-center items-center hover:bg-gray-100 border w-8 h-8"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
            className="flex justify-center items-center hover:bg-gray-100 border w-8 h-8"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id, item.size)}
          className="hover:bg-red-50 ml-4 p-2 rounded text-red-500"
          title="Remove from cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
