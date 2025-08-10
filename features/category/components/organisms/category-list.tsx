'use client';
import Heading from '@/shared/components/atoms/heading';
import Link from 'next/link';
import { useCategories } from '../../hooks/use-categories';

export default function CategoriesList() {
  const { categories } = useCategories();
  return (
    <div className="my-12 px-4">
      <Heading className="mb-8 text-2xl text-center" text1={'Shop'} text2={"by Category"} />
      <div className="gap-6 grid grid-cols-2 md:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.label} href={`/collection?category=${category.value}`}>
            <div
              className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-lg font-semibold text-center transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 select-none"
              tabIndex={0}
              role="button"
              aria-label={`Browse ${category.label} category`}
            >
              {category.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
