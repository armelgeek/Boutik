import { useCart } from '@/features/products/hooks/use-cart';
import Heading from '@/shared/components/atoms/heading';

interface CartTotalProps {
  showTitle?: boolean;
  className?: string;
}

const CartTotal = ({ showTitle = false, className = '' }: CartTotalProps) => {
  const { currency, delivery_fee, getCartAmount, cartItems } = useCart();

  return (
    <div className={`flex flex-col ${className}`}>
      {showTitle && (
        <div className="mb-4 text-2xl">
          <Heading text1={'CART'} text2={'TOTAL'} className='text-left' />
        </div>
      )}


      <div className="flex flex-col gap-2 pt-3 border-t text-sm">
        <div className="flex justify-between gap-3">
          <p>Sous-total</p>
          <p>{currency} {getCartAmount().toLocaleString()}.00</p>
        </div>
      
        <div className="flex justify-between mt-2 pt-2 border-t font-medium text-sm">
          <p>Total</p>
          <p>
            {currency} {(getCartAmount() === 0 ? 0 : getCartAmount()).toLocaleString()}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
