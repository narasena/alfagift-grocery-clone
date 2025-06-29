'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import apiInstance from '@/utils/api/apiInstance'

interface Produk {
  barcode?: string
  bpomId?: number
  brandId?: number
  createdAt: string
  deletedAt?: string
  description: string
  dimensions: string
  id: string
  name: string
  plu?: string
  price: number
  productBrand?: null
  productImage: GambarProduk[]
  productSubCategory: SubKategoriProduk
  productSubCategoryId: number
  sku: string
  slug: string
  updatedAt: string
  weight: number
}

interface GambarProduk {
  cldPublicId: string
  createdAt: string
  deletedAt: string
  id: string
  imageUrl: string
  isMainImage: boolean
  productId: string
  updatedAt: string
}

interface SubKategoriProduk {
  createdAt: string
  deletedAt?: string
  description?: string
  id: number
  name: string
  productCategory: KategoriProduk
  productCategoryId: number
  slug: string
  updatedAt: string
}

interface KategoriProduk {
  createdAt: string
  deletedAt?: string
  description?: string
  id: number
  name: string
  slug: string
  updatedAt: string
}

export default function DaftarProduk() {
  const [produk, setProduk] = useState<Produk[]>([])
  const [sedangMemuat, setSedangMemuat] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ambilProduk = async () => {
    try {
      const response = await apiInstance.get('/product/all')

      if (response.data.success) {
        setProduk(response.data.products)
        setSedangMemuat(false)
      }
    } catch (err) {
      console.error('Gagal mengambil produk:', err)
      setError('Gagal memuat produk. Silakan coba lagi nanti.')
      setSedangMemuat(false)
    }
  }

  useEffect(() => {
    ambilProduk()
  }, [])

  if (sedangMemuat) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
        <Link href="/products" className="text-green-600 hover:text-green-700 text-sm font-medium">
          Lihat Semua
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {produk.map((produk) => (
          <div key={produk.id} className="group bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/product/${produk.id}`} className="block">
              <div className="relative h-48 sm:h-56 mb-3 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={produk.productImage[0]?.imageUrl || '/placeholder-produk.png'}
                  alt={produk.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="bg-white text-green-600 p-2 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-colors"
                    aria-label={`Tambahkan ${produk.name} ke keranjang`}
                  >
                    <FaShoppingCart size={16} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">
                  {produk.productSubCategory?.name || 'Umum'}
                </p>
                <h3 className="font-medium text-gray-800 text-sm sm:text-base mb-1 truncate">
                  {produk.name}
                </h3>
                <p className="font-bold text-green-600">
                  Rp{produk.price.toLocaleString('id-ID')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}