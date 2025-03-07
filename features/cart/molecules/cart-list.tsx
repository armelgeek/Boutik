'use client';
import { DisplayCartItem } from '../hooks/use-sorted-cart';
import CartItem from './cart-item';
import EmptyCart from './empty-cart';

interface CartListProps {
  items: DisplayCartItem[];
}

const CartList = ({ items }: CartListProps) => {
  if (!items || items.length === 0) {
    return <EmptyCart />;
  }
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <CartItem key={`${item.id}-${item.size}-${index}`} item={item} />
      ))}
    </div>
  );
};

export default CartList;
