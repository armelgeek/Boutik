import FilterCheckbox from "../atoms/filter-checkbox";

const CategoryFilter: React.FC<{
  showFilter: boolean;
  toggleCategory: (category: string) => void;
}> = ({ showFilter, toggleCategory }) => {
  return (
    <div
      className={`border border-gray-300 pl-5 py-3 mt-6 ${
        showFilter ? '' : 'hidden'
      } sm:block`}
    >
      <p className="mb-3 text-sm font-medium">CATEGORIES</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {['Men', 'Women', 'Kids'].map((category) => (
          <FilterCheckbox
            key={category}
            value={category}
            label={category.toUpperCase()}
            onChange={() => toggleCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;