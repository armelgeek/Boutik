import { useShop } from "./use-shop";

export const useOrders = () => {
  const { orders, addOrder } = useShop();

  return {
    orders,
    addOrder,
    getOrderCount: () => orders.length,
    getTotalOrderedItems: () => orders.reduce((total, order) => total + order.quantity, 0)
  };
};