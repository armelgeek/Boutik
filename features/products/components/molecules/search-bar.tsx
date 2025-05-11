"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "@/components/ui/multiselect";
import { useProductFilter } from "../../hooks/use-filter";
import { useRouter } from "next/navigation";

const SearchBar = ({ isOnSearchPage = false }) => {
  const router = useRouter();
  const { search, setSearch } = useProductFilter();
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    if (!isOnSearchPage) {
      router.push(`/collection?q=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className="bg-gray-50 border-t border-b text-center">
      <form onSubmit={handleSubmit} className="inline-flex justify-center items-center px-5 py-2 border border-gray-400">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-inherit outline-none text-sm"
        />
        <button type="submit" className="bg-transparent p-0 border-0 cursor-pointer">
          <Image src={assets.search_icon} alt="Search icon" className="w-4" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;