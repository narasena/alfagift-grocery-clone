"use client";
import { useCategory } from "@/features/(user)/c/hooks/useCategory";
import * as React from "react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { IoStorefront } from "react-icons/io5";
import { RiTimerFlashFill } from "react-icons/ri";
import useCart from "@/features/(user)/p/hooks/useCart";
import { IProductDetails } from "@/types/products/product.type";
import { IProductDetailsCategoryResponse } from "@/types/products/product.category.type";
export interface IAppProps {}

export default function CategorySlugPage(props: IAppProps) {
  const { category, breadcrumbLinks, products, storeId } = useCategory();
  const { cart, handleAddToCart, openModal } = useCart();
  console.log("Category Products:", products);

  return (
    <div className="sm:max-w-[960px] lg:max-w-[1100px] mx-auto p-[15px]">
      {/* Breadcrumb */}
      <div className="hidden sm:flex sm:border sm:border-gray-100 items-center px-6 py-4 rounded-full w-full shadow-md my-2">
        {breadcrumbLinks.map((link, index) => (
          <React.Fragment key={index}>
            {link.href === "#" ? (
              <span className="text-xs text-gray-500">{link.label}</span>
            ) : (
              <Link href={link.href} className="text-xs text-gray-500 hover:text-red-700">
                {link.label}
              </Link>
            )}
            {index !== breadcrumbLinks.length - 1 && (
              <span className="mx-2 text-red-500">
                <IoIosArrowDroprightCircle />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* page title */}
      <div className="w-full flex flex-col gap-1.5 my-6">
        <div className="flex flex-col">
          <span className="text-xl tracking-tight font-bold text-gray-800">{category?.name}</span>
        </div>
        <div className="mb-4 text-xs text-[#999999]">
          <span>{`Menampilkan ${products.length} produk`}</span>
        </div>
      </div>
      {/* cards */}
      <div className="md:flex md:flex-wrap w-full grid grid-cols-2 gap-2">
        {products.map((product) => (
          <div className="sm:max-w-[16.667%] sm:min-w-[160px] lg:max-w-[190px] md:max-h-[400px] md:px-[15px]">
            <div className="block rounded-md shadow-md mb-6">
              <Link href={`/p/${product.slug}`} className="flex flex-col ">
                <div className="overflow-hidden centered">
                  <CldImage src={product.productImage[0].imageUrl} width={144} height={144} alt={product.name} />
                </div>
                <div className="px-2 text-sm h-[45px] overflow-hidden text-ellipsis">{product.name}</div>
                <div className="p-2">
                  <div className="h-5 flex items-center">
                    {product.productDiscountHistories.length > 0 && (
                      <span className="text-[10px] h-max line-through text-[#999999]">
                        {product.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-base text-red-600">
                      {product.productDiscountHistories.length > 0
                        ? (product.productDiscountHistories[0].discountValue > 100
                            ? product.price - product.productDiscountHistories[0].discountValue
                            : product.price * (1 - product.productDiscountHistories[0].discountValue / 100)
                          ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })
                        : product.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })}
                    </span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1 *:min-h-3 *:w-full text-[10px]">
                  <div className="flex items-center gap-2">
                    <IoStorefront className="text-red-600 text-sm" />
                    <span className="italic text-[#999999]">Produk Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiTimerFlashFill className="text-red-600 text-sm" />
                    <span className="font-bold text-red-600">Pengiriman Instan</span>
                  </div>
                </div>
              </Link>
              <div className="p-2 border-t border-gray-300 cursor-pointer">
                <button
                  type="button"
                  onClick={() => handleAddToCart(1, product?.id, storeId!, product as IProductDetailsCategoryResponse)}
                  className="py-2 w-full bg-red-600 rounded-md font-medium text-white hover:bg-red-700 cursor-pointer"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
