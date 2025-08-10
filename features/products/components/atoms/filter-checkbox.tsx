"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterCheckboxProps {
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  className?: string;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  value,
  label,
  onChange,
  checked,
  className = ""
}) => {
  const id = `checkbox-${value.replace(/\s+/g, '-').toLowerCase()}`;

  const handleCheckedChange = (checkedState: boolean | "indeterminate") => {
    const syntheticEvent = {
      target: {
        type: "checkbox",
        checked: checkedState === true,
        value
      },
      preventDefault: () => { },
      stopPropagation: () => { }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div
      className={`flex items-center gap-3 py-1 px-2 rounded-lg transition-colors group ${className} hover:bg-orange-50 focus-within:ring-2 focus-within:ring-orange-400/70`}
    >
      <Checkbox
        id={id}
        value={value}
        checked={checked}
        className="text-orange-500 border-gray-300 focus:ring-2 focus:ring-orange-400/70 rounded transition-colors"
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor={id}
        className="text-base font-medium text-gray-800 cursor-pointer select-none group-hover:text-orange-600 transition-colors"
      >
        {label}
      </Label>
    </div>
  );
};

export default FilterCheckbox;