import FilterCheckbox from "../atoms/filter-checkbox";
import { useCategories } from "@/features/category/hooks/use-categories";

const CategoryFilter: React.FC<{
  showFilter: boolean;
  toggleCategory: (category: string) => void;
}> = ({ showFilter, toggleCategory }) => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className="mb-3 font-medium text-sm">CATEGORIES</p>
        <div className="animate-pulse">
          <div className="bg-gray-200 mb-2 rounded w-3/4 h-4"></div>
          <div className="bg-gray-200 mb-2 rounded w-2/3 h-4"></div>
          <div className="bg-gray-200 rounded w-1/2 h-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 bg-white pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-3 font-medium text-sm">CATEGORIES</p>
      <div className="flex flex-col gap-2 font-light text-gray-700 text-sm">
        {categories.map((category) => (
          <FilterCheckbox
            key={category.value}
            value={category.value}
            label={category.label}
            onChange={() => toggleCategory(category.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;