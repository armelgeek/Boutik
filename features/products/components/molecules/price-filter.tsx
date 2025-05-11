"use client";
import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/use-debounce';

interface PriceFilterProps {
  showFilter: boolean;
  onPriceChange: (minPrice: number | null, maxPrice: number | null) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ showFilter, onPriceChange }) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    const min = debouncedMinPrice ? parseInt(debouncedMinPrice) : null;
    const max = debouncedMaxPrice ? parseInt(debouncedMaxPrice) : null;
    onPriceChange(min, max);
  }, [debouncedMinPrice, debouncedMaxPrice, onPriceChange]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMaxPrice(value);
    }
  };

  return (
    <div className={`border border-gray-300 bg-white px-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-3 font-medium text-sm">PRICE RANGE</p>
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="minPrice" className="block mb-1 text-gray-600 text-sm">
            Min Price
          </label>
          <input
            type="text"
            id="minPrice"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block mb-1 text-gray-600 text-sm">
            Max Price
          </label>
          <input
            type="text"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
