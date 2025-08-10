import React from "react";
import { Filter } from "lucide-react";

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
        className={`my-2 flex items-center bg-white py-3 px-2 justify-between select-none ${collapsible ? 'cursor-pointer hover:bg-orange-50 rounded-lg transition-colors' : ''}`}
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? showFilter : undefined}
      >
        <div className="flex items-center gap-2">
          <Filter className={`w-5 h-5 text-orange-500 ${iconClassName}`} />
          <span className="font-semibold text-lg uppercase tracking-wide">
            {title}
          </span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <span className="inline-flex justify-center items-center bg-orange-100 px-2 py-0.5 rounded-full font-semibold text-orange-700 text-xs ml-1">
              {badgeCount}
            </span>
          )}
        </div>
        {collapsible && (
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out origin-top ${showFilter
          ? 'opacity-100'
          : 'pacity-0 sm:max-h-screen sm:opacity-100'
        }`}
        aria-hidden={!showFilter}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterOption;