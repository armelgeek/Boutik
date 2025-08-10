import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="flex sm:flex-row flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Content Section */}
      <div className="flex justify-center items-center px-8 md:px-12 py-12 w-full sm:w-1/2">
        <div className="max-w-md">
          {/* Small badge */}
          <div className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            New Collection
          </div>
          
          {/* Main heading */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Elegant style,
            <span className="text-orange-500"> unbeatable prices</span>
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Discover our collection of trendy clothing.
            Premium quality at affordable prices.
          </p>
          
          {/* CTA Button */}
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            Shop now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full sm:w-1/2 h-64 sm:h-96 overflow-hidden">
        <Image
          src="/hero_img.png"
          alt="Clothing collection"
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};

export default Hero;
