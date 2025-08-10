import { useCart } from '@/features/products/hooks/use-cart';
import Heading from '@/shared/components/atoms/heading';

interface CartTotalProps {
  showTitle?: boolean;
  className?: string;
}

const CartTotal = ({ showTitle = false, className = '' }: CartTotalProps) => {
  const { currency, delivery_fee, getCartAmount, cartItems } = useCart();
  const subtotal = getCartAmount();
  const total = subtotal; // Add delivery_fee if needed

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {showTitle && (
        <div className="mb-4 text-2xl">
          <Heading text1={'Cart'} text2={'Total'} className='text-left' />
        </div>
      )}
      <div className="flex flex-col gap-3 pt-2 border-t text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{currency} {subtotal.toLocaleString()}.00</span>
        </div>
        {/* Uncomment if you want to show delivery fee
        <div className="flex justify-between gap-3">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium">{currency} {delivery_fee?.toLocaleString() ?? '0.00'}</span>
        </div>
        */}
        <div className="flex justify-between mt-3 pt-3 border-t font-bold text-base">
          <span className="text-gray-900">Total</span>
          <span className="text-orange-600">{currency} {(total === 0 ? 0 : total).toLocaleString()}.00</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
