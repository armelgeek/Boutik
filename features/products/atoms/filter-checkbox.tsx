import React from "react";
const FilterCheckbox: React.FC<{
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, label, onChange }) => {
  return (
    <p className="flex gap-2">
      <input
        type="checkbox"
        className="w-3"
        value={value}
        onChange={onChange}
      />
      {label}
    </p>
  );
};
export default FilterCheckbox;