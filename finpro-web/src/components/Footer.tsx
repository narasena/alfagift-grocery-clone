'use client'

import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Layanan Pelanggan */}
          <div>
            <h4 className="font-semibold mb-3">Layanan Pelanggan</h4>
            <ul className="space-y-1">
              <li>Pertanyaan Umum</li>
              <li>Cara Belanja</li>
              <li>A-Poin</li>
              <li>Gratis Ongkir</li>
              <li>Beli Voucher</li>
            </ul>
          </div>

          {/* Jelajahi Alfacift */}
          <div>
            <h4 className="font-semibold mb-3">Jelajahi Alfacift</h4>
            <ul className="space-y-1">
              <li>Tentang Alfacift</li>
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan Privasi</li>
              <li>Karir</li>
              <li>Blog</li>
            </ul>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <h4 className="font-semibold mb-3">Metode Pembayaran</h4>
            <div className="flex gap-2 mb-4">
              <Image src="/icons/cod.png" alt="COD" width={40} height={24} />
              <Image src="/icons/bca.png" alt="BCA" width={40} height={24} />
              <Image src="/icons/mandiri.png" alt="Mandiri" width={40} height={24} />
              <Image src="/icons/visa.png" alt="Visa" width={40} height={24} />
            </div>
            <h4 className="font-semibold mb-3">Layanan Pengiriman</h4>
            <Image src="/icons/alfamart-courier.png" alt="Delivery" width={40} height={40} />
          </div>

          {/* Ikuti Kami */}
          <div>
            <h4 className="font-semibold mb-3">Ikuti Kami</h4>
            <div className="flex gap-4 text-xl">
              <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer" />
              <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            </div>
          </div>

          {/* Kontak & App */}
          <div>
            <h4 className="font-semibold mb-3">Hubungi Kami</h4>
            <p className="mb-1">📧 alfacare@sat.co.id</p>
            <p className="mb-4">📞 1500-959</p>
            <div className="flex gap-2">
              <Image src="/icons/googleplay.png" alt="Google Play" width={120} height={40} />
              <Image src="/icons/appstore.png" alt="App Store" width={120} height={40} />
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-10">
          © 2022, PT. Sumber Alfaria Trijaya
        </div>
      </div>
    </footer>
  )
}
