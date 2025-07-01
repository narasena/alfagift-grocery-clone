'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa'
import SelectCategory from './SelectCategory'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/vercel.svg" alt="Grocery Logo" width={120} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Navigation links - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <SelectCategory />
            <Link href="/deals" className="text-gray-700 hover:text-green-600">
              Deals
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-red-600">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-red-600">
              <FaUser className="text-xl" />
            </Link>
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
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FaSearch className="absolute left-7 top-[4.5rem] text-gray-400" />
            </div>
            <SelectCategory />
            <Link href="/deals" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Deals
            </Link>
            <Link href="/cart" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Cart
            </Link>
            <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}