import { useCart } from '@/features/products/hooks/use-cart';
import Heading from '@/shared/components/atoms/heading';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useCart();

  return (
    <div className="flex flex-col justify-end">
      <div className="text-2xl">
        <Heading text1={'CART'} text2={'TOTAL'} className='text-left'  />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm ">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {' '}
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {' '}
            {currency} {delivery_fee}.00
          </p>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {' '}
            {currency}{' '}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
