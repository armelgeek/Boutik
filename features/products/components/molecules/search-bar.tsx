import { assets } from "@/assets/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "@/components/ui/multiselect";
import { useProductFilter } from "../../hooks/use-filter";

const SearchBar = () => {
  const { search, setSearch } = useProductFilter();
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="w-[450px] inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-8 rounded-full">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <Image src={assets.search_icon} alt="Search icon" className="w-4" />
      </div>
    </div>
  );
};

export default SearchBar;
