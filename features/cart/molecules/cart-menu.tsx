'use client';
import { assets } from "@/assets/assets";
import { useCart } from "@/features/products/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";

const CartMenu = () => {
  const { getCartCount } = useCart();
  const count = getCartCount();
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded-lg group"
      aria-label="View cart"
    >
      <Image
        src={assets.cart_icon}
        alt="Cart"
        className="group-hover:scale-110 transition-transform duration-150"
        width={24}
        height={24}
        priority
      />
      {count > 0 && (
        <span className="absolute -right-1.5 -bottom-1.5 w-5 h-5 flex items-center justify-center bg-orange-500 text-white rounded-full text-[10px] font-bold shadow-md border-2 border-white animate-bounce-in">
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartMenu;