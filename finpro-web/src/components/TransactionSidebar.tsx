"use client";

import { useState } from "react";

export default function TransactionSidebar() {
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
      <h1 className="text-md font-semibold text-black">Nama Pengguna</h1>
      <div className="-mx-6 h-[0.5px] bg-gray-200 my-3" />

      {/* Transaksi Dropdown */}
      <button
        onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
        className="flex items-center justify-between w-full text-sm text-black font-semibold"
      >
        <span>Transaksi</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isTransaksiOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isTransaksiOpen && (
        <div className="mt-2 pl-4 space-y-2">
          {["Terbuat", "Menunggu Pembayaran", "Sedang Diproses", "Dikirim", "Selesai", "Batal"].map((status) => (
            <a key={status} href="#" className="block text-sm text-gray-600 hover:text-black">
              {status}
            </a>
          ))}
        </div>
      )}

      <div className="-mx-6 h-[0.5px] bg-gray-200 my-3" />

      {/* My Account */}
      <button
        onClick={() => setIsMyAccountOpen(!isMyAccountOpen)}
        className="flex items-center justify-between w-full text-sm text-black font-semibold"
      >
        <span>Akun Saya</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isMyAccountOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isMyAccountOpen && (
        <div className="mt-2 pl-4 space-y-2">
          <a href="#" className="block text-sm text-gray-600 hover:text-black">
            Pengaturan Akun
          </a>
        </div>
      )}
    </div>
  );
}
