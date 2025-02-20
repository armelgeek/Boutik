import { useShop } from "./use-shop";

export const useSearch = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShop();

  return {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    clearSearch: () => setSearch('')
  };
};