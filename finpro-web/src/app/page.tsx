'use client'

import Footer from "@/components/Footer"
import HeroCarousel from "../components/HeroCarousel"
import Navbar from "../components/Navbar"
import ProductList from "../components/ProductList"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Carousel */}
          <HeroCarousel />
          
          {/* Product List */}
          <ProductList />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}