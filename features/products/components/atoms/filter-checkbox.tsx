"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterCheckboxProps {
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  value,
  label,
  onChange,
  checked
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
    <div className="flex items-center space-x-2 py-1">
      <Checkbox
        id={id}
        value={value}
        checked={checked}
        className="text-white"
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor={id}
        className="text-md cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default FilterCheckbox;