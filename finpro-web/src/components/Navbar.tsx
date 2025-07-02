"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import SelectCategory from "./SelectCategory";
import ProfileDropdown from "./ProfileDropdown";
import SearchBarDropdownProducts from "./filters/SearchBarDropdownProducts";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmWWSU4u5wGIVkwL2LxKb6c_p0X8BAued88g&s" alt="Grocery Logo" width={120} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />}>
              <SearchBarDropdownProducts onProductSelect={(product) => console.log('Selected:', product)} />
            </Suspense>
          </div>

          {/* Navigation links - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-5">
            <SelectCategory />
            <Link href="/deals" className="text-gray-700 hover:text-red-600">
              Promo
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-red-600">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <div className="text-gray-700 hover:text-red-600">
              <ProfileDropdown />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <div className="mb-3">
              <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                <SearchBarDropdownProducts onProductSelect={(product) => console.log('Selected:', product)} />
              </Suspense>
            </div>
            <div></div>
            <SelectCategory />
            <Link href="/deals" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Deals
            </Link>
            <Link href="/cart" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Cart
            </Link>
            <ProfileDropdown mobile />
          </div>
        </div>
      )}
    </nav>
  );
}
