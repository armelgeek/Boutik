import { Product } from "@/features/products/config/product.type";
import { useShop } from "./use-shop";

export const useProducts = () => {
  const { products, currency } = useShop();

  return {
    products,
    currency,
    getProductById: (id: string) => products.find((product: Product) => product.id === id),
    getFilteredProducts: (searchTerm: string) => 
      products.filter(product => 
        Object.values(product).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
  };
};