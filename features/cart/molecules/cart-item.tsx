'use client';
import { DisplayCartItem } from '../hooks/use-sorted-cart';
import { useShop } from '@/features/products/hooks/use-shop';

interface CartItemProps {
  item: DisplayCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { currency, updateQuantity, removeFromCart } = useShop();
  // Only use the first image if multiple URLs are present
  const imageUrl = Array.isArray(item.image)
    ? item.image[0]
    : (item.image || 'https://placehold.co/400');

  return (
    <div className="flex justify-between items-center py-5 px-2 sm:px-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex gap-4 items-center">
        <img
          src={imageUrl}
          width={90}
          height={90}
          alt={item.name}
          className="object-cover rounded-lg border border-gray-100 shadow-sm w-[90px] h-[90px] bg-gray-50"
        />
        <div className='flex flex-col gap-1 min-w-[120px]'>
          <p className="mb-1 font-semibold text-gray-900 truncate max-w-[120px]">{item.name}</p>
          <div className="text-gray-500 text-xs flex flex-col gap-0.5">
            <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>
            <span>Price: <span className="font-medium text-gray-700">{currency}{Number(item.price).toFixed(2)}</span></span>
          </div>
          <span className="font-semibold text-sm text-orange-600 mt-1">
            Total: {currency}{(Number(item.price) * Number(item.quantity)).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-2">
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
          <button
            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
            className="flex justify-center items-center w-7 h-7 rounded hover:bg-orange-100 text-orange-600 font-bold text-lg transition-colors focus-visible:ring-2 focus-visible:ring-orange-400/70"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-7 text-center font-medium text-gray-900">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
            className="flex justify-center items-center w-7 h-7 rounded hover:bg-orange-100 text-orange-600 font-bold text-lg transition-colors focus-visible:ring-2 focus-visible:ring-orange-400/70"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id, item.size)}
          className="hover:bg-red-50 p-2 rounded-lg text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-red-400/70"
          title="Remove from cart"
          aria-label="Remove from cart"
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
