'use client';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Your cart is empty</h3>
        <p className="text-gray-500">
          Explore our products and add them to your cart
        </p>
        <Link
          href="/collection"
          className="inline-block px-6 py-3 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
