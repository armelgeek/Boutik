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
    <div className={`border border-gray-300 px-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
      <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="minPrice" className="block text-sm text-gray-600 mb-1">
            Min Price
          </label>
          <input
            type="text"
            id="minPrice"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm text-gray-600 mb-1">
            Max Price
          </label>
          <input
            type="text"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
