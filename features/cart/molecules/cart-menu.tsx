'use client';
import { assets } from "@/assets/assets"
import { useCart } from "@/features/products/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"

const CartMenu = () => {
    const { getCartCount } = useCart()
    return (
     <Link href="/cart" className="relative ">
          <Image src={assets.cart_icon} alt="" className="w-5 min-w-5 " />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>   
    )
}
export default CartMenu;