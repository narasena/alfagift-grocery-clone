"use client";

import { useEffect, useState } from "react";

const carouselItems = [
  {
    id: 1,
    image: "https://alfamart.co.id/storage/page/June2025/ECrSENI2FqDzBWKfMKCD.jpg",
    title: "Fresh Groceries Delivered",
    description: "Get fresh produce delivered to your doorstep",
  },
  {
    id: 2,
    image:
      "https://asset-2.tstatic.net/bali/foto/bank/images/promo-alfamart-besok-12-maret-2021-diskon-beras-diapers-mi-instan-beli-susu-cashback-rp17500.jpg",
    title: "Weekly Special Offers",
    description: "Save big on your favorite items",
  },
  {
    id: 3,
    image: "https://alfamart.co.id/storage/page/June2025/RXLjI0GnsfV4RfF6p2wp.jpg",
    title: "Organic Selection",
    description: "Discover our range of organic products",
  },
];

export default function HeroCarousel() {
  // Auto-scroll (opsional, bisa dihapus kalau ingin manual saja)
  const [current, setCurrent] = useState(0);
  console.log(current);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel w-full rounded-lg overflow-hidden">
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          id={`slide${index + 1}`}
          className="carousel-item relative w-full"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">
              {item.title}
            </h2>
            <p className="text-white text-lg md:text-xl">{item.description}</p>
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a
              href={`#slide${
                index === 0 ? carouselItems.length : index
              }`}
              className="btn btn-circle"
            >
              ❮
            </a>
            <a
              href={`#slide${
                index === carouselItems.length - 1 ? 1 : index + 2
              }`}
              className="btn btn-circle"
            >
              ❯
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
