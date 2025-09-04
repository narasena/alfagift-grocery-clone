'use client'

import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import { BanknoteArrowDown, CreditCard, Landmark, Truck } from 'lucide-react'

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
              <BanknoteArrowDown size={24} />
              <Landmark size={24} />

              <CreditCard size={24} />
            </div>
            <h4 className="font-semibold mb-3">Layanan Pengiriman</h4>
            <Truck size={24} />
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
              <div>Google Play</div>
              <div>App Store</div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-10">© 2022, PT. Sumber Alfaria Trijaya</div>
      </div>
    </footer>
  );
}
