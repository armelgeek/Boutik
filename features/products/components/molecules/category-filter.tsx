import FilterCheckbox from "../atoms/filter-checkbox";
import { useCategories } from "@/features/category/hooks/use-categories";

const CategoryFilter: React.FC<{
  showFilter: boolean;
  toggleCategory: (category: string) => void;
}> = ({ showFilter, toggleCategory }) => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className={`border border-gray-100 bg-white rounded-xl px-5 py-4 mt-3 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className="mb-4 font-semibold text-base text-gray-800 tracking-wide uppercase">Categories</p>
        <div className="animate-pulse space-y-2">
          <div className="bg-gray-200 rounded h-4 w-3/4" />
          <div className="bg-gray-200 rounded h-4 w-2/3" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-100 bg-white rounded-xl px-5 py-4 mt-3 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-4 font-semibold text-base text-gray-800 tracking-wide uppercase">Categories</p>
      <div className="flex flex-col gap-2 text-gray-700 text-sm">
        {categories.map((category) => (
          <FilterCheckbox
            key={category.value}
            value={category.value}
            label={category.label}
            onChange={() => toggleCategory(category.value)}
            className="hover:bg-orange-50 focus-within:ring-2 focus-within:ring-orange-400/70 rounded transition-colors px-2 -mx-2"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;