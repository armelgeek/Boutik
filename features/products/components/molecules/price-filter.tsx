"use client";
import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/use-debounce';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface PriceFilterProps {
  showFilter: boolean;
  onPriceChange: (minPrice: number | null, maxPrice: number | null) => void;
  minPossiblePrice?: number;
  maxPossiblePrice?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ 
  showFilter, 
  onPriceChange,
  minPossiblePrice = 0,
  maxPossiblePrice = 1000
}) => {
  const [minPrice, setMinPrice] = useState<string>(minPossiblePrice.toString());
  const [maxPrice, setMaxPrice] = useState<string>(maxPossiblePrice.toString());
  const [sliderValue, setSliderValue] = useState<number[]>([minPossiblePrice, maxPossiblePrice]);
  
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedSliderValue = useDebounce(sliderValue, 300);

  useEffect(() => {
    const min = debouncedMinPrice ? parseInt(debouncedMinPrice) : null;
    const max = debouncedMaxPrice ? parseInt(debouncedMaxPrice) : null;
    onPriceChange(min, max);
  }, [debouncedMinPrice, debouncedMaxPrice, onPriceChange]);

  // Update inputs when slider changes
  useEffect(() => {
    setMinPrice(debouncedSliderValue[0].toString());
    setMaxPrice(debouncedSliderValue[1].toString());
  }, [debouncedSliderValue]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMinPrice(value);
      
      const numValue = value === '' ? minPossiblePrice : parseInt(value);
      if (numValue <= parseInt(maxPrice)) {
        setSliderValue([numValue, parseInt(maxPrice)]);
      }
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMaxPrice(value);
      
      const numValue = value === '' ? maxPossiblePrice : parseInt(value);
      if (numValue >= parseInt(minPrice)) {
        setSliderValue([parseInt(minPrice), numValue]);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  return (
    <div className={`border rounded-lg bg-white px-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-4 font-medium text-sm">PRICE RANGE</p>
      
      <div className="mb-6 px-1">
        <Slider
          value={sliderValue}
          min={minPossiblePrice}
          max={maxPossiblePrice}
          step={1}
          onValueChange={handleSliderChange}
          className="my-6"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor="minPrice" className="block mb-2 font-medium text-gray-600 text-xs">
            Min
          </label>
          <div className="relative">
            <span className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">$</span>
            <Input
              type="text"
              id="minPrice"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="0"
              className="pl-7"
            />
          </div>
        </div>
        
        <div className="flex flex-none justify-center items-center">
          <div className="bg-gray-300 w-4 h-px"></div>
        </div>
        
        <div className="flex-1">
          <label htmlFor="maxPrice" className="block mb-2 font-medium text-gray-600 text-xs">
            Max
          </label>
          <div className="relative">
            <span className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">$</span>
            <Input
              type="text"
              id="maxPrice"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Max"
              className="pl-7"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-gray-100 border-t">
        <div className="flex justify-between items-center text-gray-500 text-xs">
          <span>Min: ${minPossiblePrice}</span>
          <span>Max: ${maxPossiblePrice}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;