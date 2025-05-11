"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/collection", label: "COLLECTION" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

const AppNav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav aria-label="Main navigation" className="relative">
      <ul className="hidden sm:flex gap-6 text-gray-700 text-sm">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`group flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? "text-orange-500" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{label}</span>
                <span
                  className={`w-1/2 h-[1.5px] bg-orange-500 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="sm:hidden flex justify-between items-center">
        <button
          onClick={toggleMobileMenu}
          className="p-2 focus:outline-none text-gray-700"
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <ul className="sm:hidden top-16 right-0 left-0 absolute flex flex-col items-center gap-4 bg-white shadow-lg py-4 text-gray-700 text-sm">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block w-full text-center p-2 transition-colors duration-200 ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default AppNav;
