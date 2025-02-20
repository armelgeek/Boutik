import { useRouter } from 'next/navigation';
import { createContext, useState } from 'react';
import { products } from '../../../assets/assets';
import { toast } from 'sonner';

export const ShopContext = createContext<unknown>(null);

const ShopContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;

  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Record<string, Record<string, number>>>({});
  const [orders, setOrders] = useState<Array<{ _id: string; size: string; quantity: number }>>([]);
  const router = useRouter();

  const addToCart = (itemId: string, size: string): void => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    setCartItems(prevItems => {
      const newItems = { ...prevItems };
      if (!newItems[itemId]) newItems[itemId] = {};
      newItems[itemId][size] = (newItems[itemId][size] || 0) + 1;
      return newItems;
    });
  };

  const addOrder = (): void => {
    const newOrder = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
      Object.entries(sizes).map(([size, quantity]) => ({
        _id: itemId,
        size,
        quantity,
      }))
    );
    setOrders(prevOrders => [...prevOrders, ...newOrder]);
    //setCartItems({});
  };

  const getCartCount = (): number => {
    return Object.values(cartItems).reduce(
      (total, sizes) => total + Object.values(sizes).reduce((sum, quantity) => sum + quantity, 0),
      0
    );
  };

  const updateQuantity = (itemId: string, size: string, quantity: number): void => {
    setCartItems(prevItems => ({
      ...prevItems,
      [itemId]: { ...prevItems[itemId], [size]: quantity },
    }));
  };

  const getCartAmount = (): number => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const productInfo = products.find(product => product._id === itemId);
      return total + Object.values(sizes).reduce((itemTotal, quantity) => {
        return itemTotal + (productInfo?.price || 0) * quantity;
      }, 0);
    }, 0);
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder,
    orders,
    router,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
