"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, Share2, ShoppingBag, Truck, Shield, RefreshCw } from "lucide-react";
import RelatedProducts from "../organisms/related-products";
import useProductInfo from "../../hooks/use-product-info";
import { motion } from "framer-motion";

const ProductInfo = ({ productId }: { productId: string }) => {
  const {
    currency,
    addToCart,
    productsData,
    image,
    setImage,
    size,
    setSize
  } = useProductInfo({
    productId
  });

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productsData) {
      setLoading(false);
    }
  }, [productsData]);

  const handleAddToCart = () => {
    if (!size && productsData?.sizes?.length) {
      // Animate the size selector to draw attention
      const sizeSelector = document.getElementById("size-selector");
      if (sizeSelector) {
        sizeSelector.classList.add("animate-pulse");
        setTimeout(() => {
          sizeSelector?.classList.remove("animate-pulse");
        }, 1000);
      }
      return;
    }
    
    setIsAdding(true);
    addToCart(productsData?.id || "", size);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="border-t-2 border-b-2 border-black rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return productsData ? (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto px-4 sm:px-6 pt-10 border-t-2 max-w-7xl transition-all duration-500 ease-in"
    >
      <div className="flex lg:flex-row flex-col gap-12">
        {/* Product Images Section */}
        <div className="flex lg:flex-row flex-col-reverse flex-1 gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 lg:gap-4 w-full lg:w-24 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
            {productsData.images && productsData.images.map((item, index) => (
              <div 
                key={index}
                onClick={() => setImage(item)}
                className={`relative flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  image === item ? "border-black" : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={item}
                  alt={`${productsData.name} thumbnail ${index + 1}`}
                  className="w-20 lg:w-full h-20 lg:h-24 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative lg:flex-1 bg-gray-50 rounded-lg w-full overflow-hidden">
            <motion.img
              key={image} // Forces animation when image changes
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={image || 'https://placehold.co/600'}
              alt={productsData.name || "Product image"}
              className="w-full h-auto object-contain aspect-square"
            />
            
            {/* Image navigation overlay (optional) */}
            <div className="right-4 bottom-4 absolute flex gap-2">
              <button 
                className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all"
                aria-label="Add to wishlist"
              >
                <Heart size={20} className="text-gray-700 hover:text-red-500 transition-colors" />
              </button>
              <button 
                className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all"
                aria-label="Share product"
              >
                <Share2 size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-1">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h1 className="font-medium text-gray-900 text-2xl sm:text-3xl">{productsData.name}</h1>
              <p className="mt-1 text-gray-500 text-sm">Product ID: {productId}</p>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Image 
                    key={i} 
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                    alt="" 
                    className="w-4 h-4" 
                  />
                ))}
              </div>
              <p className="ml-2 text-gray-500 text-sm">(122 reviews)</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <p className="font-semibold text-gray-900 text-2xl sm:text-3xl">
                {currency}{productsData.price}
              </p>
              {productsData.originalPrice && (
                <p className="text-gray-500 text-lg line-through">
                  {currency}{productsData.originalPrice}
                </p>
              )}
              {productsData.originalPrice && (
                <span className="bg-green-500 px-2 py-1 rounded-md font-medium text-white text-xs">
                  {Math.round((1 - (productsData.price / productsData.originalPrice)) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-gray-200 border-t"></div>

          {/* Size Selection */}
          <div id="size-selector" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-900">Select Size</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {productsData.sizes && productsData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`w-12 h-12 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200
                  ${item === size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {!size && productsData.sizes?.length > 0 && (
              <p className="text-red-500 text-sm">Please select a size</p>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="space-y-4 mt-6">
            <p className="font-medium text-gray-900">Quantity</p>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="flex justify-center items-center hover:bg-gray-100 border border-gray-300 rounded-l-md w-10 h-10"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="border-gray-300 border-t border-b w-16 h-10 text-center"
                min="1"
              />
              <button 
                onClick={increaseQuantity}
                className="flex justify-center items-center hover:bg-gray-100 border border-gray-300 rounded-r-md w-10 h-10"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex sm:flex-row flex-col gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`relative  px-11 flex items-center justify-center gap-2 py-2 text-white font-medium rounded-md transition-all duration-300 ${
                isAdding 
                  ? 'bg-green-600' 
                  : 'bg-black hover:bg-gray-800 active:bg-gray-900'
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-check-mark" viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 12l6 6L20 6"
                    />
                  </svg>
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  ADD TO CART
                </>
              )}
            </button>
            
          </div>

          {/* Shipping & Returns Info */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={20} />
              <p className="text-sm">Free delivery on orders above {currency}49</p>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield size={20} />
              <p className="text-sm">100% Original authenticated products</p>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw size={20} />
              <p className="text-sm">Easy 7-day return and exchange policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab("description")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "description" ? "border-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab("details")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details" ? "border-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Details & Care
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "reviews" ? "border-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews (122)
          </button>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="max-w-none text-gray-600 prose">
              <p className="text-base leading-relaxed">
                {productsData.description || "No description available for this product."}
              </p>
            </div>
          )}
          
          {activeTab === "details" && (
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">Product Features</h3>
                <ul className="space-y-2 mt-3 pl-5 text-sm list-disc">
                  <li>Premium quality materials</li>
                  <li>Expertly crafted for durability</li>
                  <li>Designed for comfort and style</li>
                  <li>Perfect for everyday use</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 text-lg">Care Instructions</h3>
                <ul className="space-y-2 mt-3 pl-5 text-sm list-disc">
                  <li>Machine wash cold with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">Customer Reviews</h3>
                  <p className="text-gray-500 text-sm">See what our customers have to say</p>
                </div>
                <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-white text-sm transition-colors">
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-6 p-6 border rounded-lg">
                <p className="text-gray-500 text-center italic">
                  Reviews will appear here once customers start sharing their experiences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

        <RelatedProducts
          category={productsData.category_id}
          subCategory={productsData.sub_category_id || ''}
        />
    </motion.div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="border-t-2 border-b-2 border-black rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};

export default ProductInfo;