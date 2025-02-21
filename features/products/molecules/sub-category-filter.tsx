import FilterCheckbox from "../atoms/filter-checkbox";

interface SubCategoryFilterProps {
  showFilter: boolean;
  toggleSubCategory: (type: string) => void;
}

const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({ showFilter, toggleSubCategory }) => {
  const subCategories: string[] = ['Topwear', 'Bottomwear', 'Winterwear'];

  return (
    <div
      className={`border border-gray-300 pl-5 py-3 my-5 ${
        showFilter ? '' : 'hidden'
      } sm:block`}
    >
      <p className="mb-3 text-sm font-medium">TYPES</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {subCategories.map((type) => (
          <FilterCheckbox
            key={type}
            value={type}
            label={type}
            onChange={() => toggleSubCategory(type)}
          />
        ))}
      </div>
    </div>
  );
};
export default SubCategoryFilter;