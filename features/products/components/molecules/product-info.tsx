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
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  return productsData ? (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-square"
            >
              <Image
                src={image || '/placeholder-product.jpg'}
                alt={productsData.name || "Product image"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </motion.div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
                aria-label="Add to wishlist"
              >
                <Heart size={18} className="text-gray-700 hover:text-orange-500 transition-colors" />
              </button>
              <button 
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
                aria-label="Share product"
              >
                <Share2 size={18} className="text-gray-700 hover:text-orange-500 transition-colors" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {productsData.images && productsData.images.map((item, index) => (
              <button 
                key={index}
                onClick={() => setImage(item)}
                className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  image === item 
                    ? "border-orange-500 ring-2 ring-orange-200" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={item}
                  alt={`${productsData.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-8">
          {/* Product Header */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-light text-gray-900 leading-tight">
                {productsData.name}
              </h1>
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                SKU: {productId.slice(-8).toUpperCase()}
              </p>
              
              {/* Category Tags */}
              {(productsData.category || productsData.subcategory) && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category directe */}
                  {productsData.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                      {productsData.category.name}
                    </span>
                  )}
                  
                  {/* Hiérarchie complète des catégories */}
                  {productsData.subcategory && productsData.subcategory.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-xs">in</span>
                      <div className="flex items-center gap-1">
                        {productsData.subcategory.map((cat, index) => (
                          <div key={cat.id} className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              {cat.name}
                            </span>
                            {index < productsData.subcategory!.length - 1 && (
                              <span className="text-gray-300 text-xs">•</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Image 
                    key={i} 
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                    alt="" 
                    width={16}
                    height={16}
                    className="w-4 h-4" 
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">(4.2)</span>
              <span className="text-gray-400 text-sm">•</span>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                122 reviews
              </button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-light text-gray-900">
                  {currency}{productsData.price}
                </p>
                {productsData.bestseller && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                Price includes all taxes • Free shipping on orders over {currency}50
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Size Selection */}
          {productsData.sizes && productsData.sizes.length > 0 && (
            <div id="size-selector" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Size</h3>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 gap-3">
                {productsData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      item === size 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {!size && productsData.sizes && productsData.sizes.length > 0 && (
                <p className="text-orange-600 text-sm font-medium">Please select a size</p>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="flex justify-center items-center w-12 h-12 rounded-l-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 text-lg">−</span>
              </button>
              <div className="flex justify-center items-center w-16 h-12 border-t border-b border-gray-300 bg-white">
                <span className="font-medium text-gray-900">{quantity}</span>
              </div>
              <button 
                onClick={increaseQuantity}
                className="flex justify-center items-center w-12 h-12 rounded-r-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 text-lg">+</span>
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`relative w-full h-14 flex items-center justify-center gap-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                isAdding 
                  ? 'bg-green-500 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isAdding ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Added to Cart
                </motion.div>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Add to Cart
                </>
              )}
            </button>
            
            <button className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 transition-colors">
              Add to Wishlist
            </button>
          </div>

          {/* Product Features */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck size={16} className="text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Free Delivery</h4>
                <p className="text-gray-600 text-sm">On orders above {currency}50</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Authentic Products</h4>
                <p className="text-gray-600 text-sm">100% original & verified</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <RefreshCw size={16} className="text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Easy Returns</h4>
                <p className="text-gray-600 text-sm">7-day return & exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { id: "description", label: "Description" },
              { id: "details", label: "Details & Care" },
              { id: "reviews", label: "Reviews (122)" }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "text-orange-600 bg-white border-b-2 border-orange-500" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-gray max-w-none"
              >
                <p className="text-gray-700 leading-relaxed text-base">
                  {productsData.description || "This premium product combines exceptional quality with modern design. Crafted with attention to detail, it offers both style and functionality for everyday use."}
                </p>
              </motion.div>
            )}
            
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">Product Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Premium quality materials
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Expertly crafted for durability
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Designed for comfort and style
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Perfect for everyday use
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">Care Instructions</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Machine wash cold with similar colors
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Do not bleach
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Tumble dry low
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        Iron on low heat if needed
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Customer Reviews</h3>
                    <p className="text-gray-600">See what our customers have to say</p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium text-white transition-colors">
                    Write a Review
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Be the first to share your thoughts about this product.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your review helps other customers make informed decisions.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <RelatedProducts
          category={productsData.category_id}
          subCategory={productsData.sub_category_id || ''}
        />
      </div>
    </motion.div>
  ) : (
    <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13 0h-2M6 13h2" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-900">Product not found</h2>
        <p className="text-gray-600 max-w-md">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;