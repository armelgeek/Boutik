import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

interface FilterOptionProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  iconClassName?: string;
  badgeCount?: number;
  collapsible?: boolean;
}

const FilterOption: React.FC<FilterOptionProps> = ({
  showFilter,
  setShowFilter,
  children,
  title = "Filters",
  className = "",
  iconClassName = "",
  badgeCount,
  collapsible = true,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowFilter(!showFilter);
    }
  };

  return (
    <div className={`min-w-52 ${className}`}>
      <div
        onClick={collapsible ? () => setShowFilter(!showFilter) : undefined}
        onKeyDown={collapsible ? handleKeyDown : undefined}
        className={`my-2 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? showFilter : undefined}
      >
        <div className="flex items-center gap-2">
          <p className="font-medium text-lg uppercase">{title}</p>

          {badgeCount !== undefined && badgeCount > 0 && (
            <span className="inline-flex justify-center items-center bg-blue-100 px-2 py-0.5 rounded-full font-medium text-blue-800 text-xs">
              {badgeCount}
            </span>
          )}
        </div>

      </div>

      <div
        className={`transition-all duration-300 ease-in-out origin-top ${showFilter
            ? 'max-h-screen opacity-100'
            : 'max-h-0 overflow-hidden opacity-0 sm:max-h-screen sm:opacity-100'
          }`}
        aria-hidden={!showFilter}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterOption;