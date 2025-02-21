'use client';
import { CartItem as CartItemType } from '@/core/domain/types/cart.type';
import CartItem from './cart-item';
import EmptyCart from './empty-cart';

interface CartListProps {
  items: CartItemType[];
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
