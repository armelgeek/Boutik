import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

interface FilterOptionProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  children: React.ReactNode;
}

const FilterOption: React.FC<FilterOptionProps> = ({ showFilter, setShowFilter, children }) => {
  return (
    <div className="min-w-52">
      <p
        onClick={() => setShowFilter(!showFilter)}
        className="my-2 text-xl flex items-center cursor-pointer gap-2"
      >
        Filters
        <Image
          src={assets.dropdown_icon}
          alt="Dropdown icon"
          width={12}
          height={12}
          className={`sm:hidden ${showFilter ? 'rotate-90' : ''}`}
        />
      </p>
      {children}
    </div>
  );
};

export default FilterOption;