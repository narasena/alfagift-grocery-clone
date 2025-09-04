"use client";

import Link from "next/link";
import ProductCard from "./product/ProductCard";
import useDisplayedProducts from "@/features/user/home/hooks/useDisplayedProducts";

export default function DaftarProduk() {
  const { displayedProducts } = useDisplayedProducts();

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
        <Link href="/products" className="text-black-600 hover:text-red-700 text-sm font-medium">
          Lihat Semua
        </Link>
      </div>

      <div className="flex w-full flex-wrap max-[524px]:grid grid-cols-2 min-[524px]:grid-cols-3 max-sm:gap-x-2">
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            slug={product.slug}
            price={product.price || 0}
            imgUrl={product.productImage[0]?.imageUrl || "/placeholder-produk.png"}
            stock={product.productStock?.[0]?.stock || 0}
            isPromo={false}
          />
        ))}
      </div>
    </div>
  );
}
