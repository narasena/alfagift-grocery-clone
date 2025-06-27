"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    image: "/vercel.svg", // Replace with actual image paths
    title: "Fresh Groceries Delivered",
    description: "Get fresh produce delivered to your doorstep",
  },
  {
    id: 2,
    image: "/next.svg", // Replace with actual image paths
    title: "Weekly Special Offers",
    description: "Save big on your favorite items",
  },
  {
    id: 3,
    image: "/vercel.svg", // Replace with actual image paths
    title: "Organic Selection",
    description: "Discover our range of organic products",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      {/* Carousel items */}
      <div className="relative h-full">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative w-full h-full">
              <Image src={item.image} alt={item.title} fill className="object-cover" priority={index === 0} />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center px-6 md:px-12">
                <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">{item.title}</h2>
                <p className="text-white text-lg md:text-xl">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              goToSlide(index);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
