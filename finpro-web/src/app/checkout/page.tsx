"use client";
import { IoTrashOutline } from "react-icons/io5";
import { BsStopwatch } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import { useState } from "react";

export default function CheckoutPage() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between">
      <div className="w-full max-w-6xl md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-700 mb-5">Ringkasan Pesanan</h1>

            {/* Detail Penerima */}
            <div className="text-black">
              <h1 className="font-semibold">Detail Penerima</h1>
              <div className="w-full h-[2px] bg-gray-100 my-3" />

              {/* Recipient Info */}
              <div className="space-y-1">
                <p>
                  <span className="">Label Alamat</span>
                </p>
                <p>
                  <span className="">Nama Penerima & No. Handphone</span>
                </p>
                <p>
                  <span className="">Jl. Contoh No.123, Jakarta</span>
                </p>
                <p>
                  <span className="">Lokasi</span>
                </p>
              </div>
            </div>

            {/* line */}
            <div className="w-full h-2 bg-gray-100 my-5" />

            {/* Delivery */}
            <div className="text-black">
              <h1 className="font-semibold">Pengiriman</h1>
              <div className="w-full h-[2px] bg-gray-100 my-3" />

              <div className="text-gray-500 space-y-1">
                <div className="flex items-center gap-2 w-max">
                  <CiCalendar className="text-lg" />
                  <h1 className="text-sm">Tanggal hari ini</h1>
                </div>
                {/* needs to be fixed */}
                <div className="flex items-center gap-2 w-max">
                  <CiClock1 className="text-lg" />
                  <p className="text-sm w-[300px] whitespace-normal">
                    Maks. 1 jam setelah pembayaran selama jam operasional (Maks. 1 jam setelah pembayaran selama jam
                    operasional (07:00 - 21:00))
                  </p>
                </div>
              </div>
            </div>
            {/* line */}
            <div className="w-full h-2 bg-gray-100 my-5" />
            <div className="text-black flex items-center gap-2 mb-2">
              <div className="">
                <BsStopwatch className="text-black" />
              </div>
              Pengiriman Instan
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border rounded p-4">
                {/* Left: Item details */}
                <div className="flex flex-col">
                  <span className="text-black font-semibold">Item 1</span>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>Rp 10,000</span>
                    <span>Quantity: 1</span>
                  </div>
                </div>

                {/* Right: Subtotal */}
                <div className="flex items-center space-x-4">
                  <div className="text-red-600 font-bold min-w-[80px] text-right">Rp 10,000</div>
                </div>
              </li>
              {/* <li className="text-black">Item 2</li> */}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="hidden md:block bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp 0</span>
              </div>
            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Total */}
            <div className="text-black font-bold">
              <div className="flex justify-between">
                <span>Total Belanja</span>
                <span>Rp 0</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition">
              Pilih Pembayaran
            </button>
          </div>

          {/* Mobile Checkout Section */}
          <div className="md:hidden">
            {/* Order Summary Dropdown (appears above when open) */}
            {isSummaryOpen && (
              <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-6 max-h-[60vh] overflow-y-auto shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
                <div className="space-y-4 text-black">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp 0</span>
                  </div>
                </div>
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 my-5" />
                {/* Total */}
                <div className="text-black font-bold">
                  <div className="flex justify-between">
                    <span>Total Belanja</span>
                    <span>Rp 0</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed Checkout Bar (always at bottom) */}
            <div className="bg-white border-t fixed bottom-0 left-0 right-0 p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1" onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isSummaryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <div className="flex flex-col">
                      <div className="text-black font-semibold">Total</div>
                      <div className="font-bold text-black">Rp {10000 * 2}</div>
                    </div>
                  </div>
                </div>
                <button className="bg-red-700 text-white text-lg p-2 rounded-lg hover:bg-red-800 transition">
                  Pilih Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
