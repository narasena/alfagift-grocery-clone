"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { IoStorefront } from "react-icons/io5";
import { RiTimerFlashFill } from "react-icons/ri";
import apiInstance from "@/utils/api/apiInstance";
import { EDiscountType } from "@/types/discounts/discount.type";

interface Produk {
  barcode?: string;
  bpomId?: number;
  brandId?: number;
  createdAt: string;
  deletedAt?: string;
  description: string;
  dimensions: string;
  id: string;
  name: string;
  plu?: string;
  price: number;
  productBrand?: null;
  productImage: GambarProduk[];
  productSubCategory: SubKategoriProduk;
  productSubCategoryId: number;
  productDiscountHistories: ProductDiscountHistory[];
  sku: string;
  slug: string;
  updatedAt: string;
  weight: number;
}

interface ProductDiscountHistory {
  discountValue: number;
  discountType: EDiscountType;
}

interface GambarProduk {
  cldPublicId: string;
  createdAt: string;
  deletedAt: string;
  id: string;
  imageUrl: string;
  isMainImage: boolean;
  productId: string;
  updatedAt: string;
}

interface SubKategoriProduk {
  createdAt: string;
  deletedAt?: string;
  description?: string;
  id: number;
  name: string;
  productCategory: KategoriProduk;
  productCategoryId: number;
  slug: string;
  updatedAt: string;
}

interface KategoriProduk {
  createdAt: string;
  deletedAt?: string;
  description?: string;
  id: number;
  name: string;
  slug: string;
  updatedAt: string;
}

export default function DaftarProduk() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ambilProduk = async () => {
    try {
      const response = await apiInstance.get("/product/all");

      if (response.data.success) {
        setProduk(response.data.products);
        setSedangMemuat(false);
      }
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
      setSedangMemuat(false);
    }
  };

  useEffect(() => {
    ambilProduk();
  }, []);

  if (sedangMemuat) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
        <Link href="/products" className="text-black-600 hover:text-red-700 text-sm font-medium">
          Lihat Semua
        </Link>
      </div>

      <div className="md:flex md:flex-wrap w-full grid grid-cols-2 gap-2">
        {produk.map((produk) => (
          <div
            key={produk.id}
            className="sm:max-w-[16.667%] sm:min-w-[160px] lg:max-w-[190px] md:max-h-[400px] md:px-[15px]"
          >
            <div className="block rounded-md shadow-md mb-6">
              <Link href={`/p/${produk.slug}`} className="flex flex-col">
                <div className="overflow-hidden centered">
                  <CldImage
                    src={produk.productImage[0]?.imageUrl || "/placeholder-produk.png"}
                    width={144}
                    height={144}
                    alt={produk.name}
                  />
                </div>
                <div className="px-2 text-sm h-[45px] overflow-hidden text-ellipsis">{produk.name}</div>
                <div className="p-2">
                  <div className="h-5 flex items-center">
                    {produk.productDiscountHistories?.length > 0 &&
                      (produk.productDiscountHistories[0]?.discountType === EDiscountType.BUY1_GET1 ? (
                        <span className="text-white bg-lime-500 py-0.5 px-1 rounded-sm font-bold text-[10px] h-max">
                          Beli 1 Gratis 1
                        </span>
                      ) : (
                        <span className="text-[10px] h-max line-through text-[#999999]">
                          {produk.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      ))}
                  </div>
                  <div>
                    <span className="font-bold text-base text-red-600">
                      {produk.productDiscountHistories?.length > 0 &&
                      produk.productDiscountHistories[0]?.discountType !== EDiscountType.BUY1_GET1
                        ? (produk.productDiscountHistories[0]?.discountType === EDiscountType.FIXED_AMOUNT
                            ? produk.price - produk.productDiscountHistories[0]?.discountValue
                            : produk.price * (1 - produk.productDiscountHistories[0]?.discountValue / 100)
                          ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })
                        : produk.price.toLocaleString("id-ID", {
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
