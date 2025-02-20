import { useShop } from "./use-shop";

export const useCart = () => {
  const { 
    cartItems, 
    addToCart, 
    getCartCount, 
    updateQuantity, 
    getCartAmount,
    currency,
    delivery_fee 
  } = useShop();

  return {
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    currency,
    delivery_fee,
    getTotalAmount: () => getCartAmount() + delivery_fee
  };
};