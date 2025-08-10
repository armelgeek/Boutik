'use client';
import Heading from '@/shared/components/atoms/heading';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCategoriesWithImages } from '../../hooks/use-categories';

export default function CategoriesList() {
  const { categories, isLoading } = useCategoriesWithImages();
  console.log('categories', categories);
  if (isLoading) {
    return (
      <div className="my-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-orange-100 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-xl"></div>

      <div className="max-w-7xl mx-auto elative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
        
          <Heading 
            className=" font-light text-gray-900 mb-4" 
            text1={'Shop by'} 
            text2={"Category"} 
          />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our carefully curated collections and find exactly what you&apos;re looking for
          </p>
        </motion.div>

        {/* Categories Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.03 }}
              className="group"
            >
              <Link href={`/collection?category=${category.id}`}>
                <div className="relative overflow-hidden rounded-xl h-48 bg-white shadow-md border border-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-orange-200">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 via-orange-50 to-gray-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
                      </div>
                    )}
                    
                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center p-6">
                    <div className="mb-2">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm drop-shadow">
                        Discover our collection
                      </p>
                    </div>

                    {/* Hover arrow */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-medium mr-2">Shop now</span>
                      <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
