import FilterCheckbox from "../atoms/filter-checkbox";
import { useSubCategories } from "@/features/category/hooks/use-sub-categories";

interface SubCategoryFilterProps {
  showFilter: boolean;
  toggleSubCategory: (type: string) => void;
}

const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({ showFilter, toggleSubCategory }) => {
  const { categories: subCategories, isLoading } = useSubCategories();

  if (isLoading) {
    return (
      <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className="mb-3 text-sm font-medium">TYPES</p>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-3 text-sm font-medium">TYPES</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {subCategories.map((type) => (
          <FilterCheckbox
            key={type.value}
            value={type.value}
            label={type.label}
            onChange={() => toggleSubCategory(type.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubCategoryFilter;