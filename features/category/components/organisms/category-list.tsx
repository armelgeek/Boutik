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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
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

        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/collection?category=${category.id}`}>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-200/30 group-hover:border-orange-200">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                        <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xl">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                      {category.name}
                    </h3>
                    
                  </div>
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
