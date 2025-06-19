"use client";
import { TbCalendarTime } from "react-icons/tb";
import { RiEBike2Line } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";

// use modal for view details
// might need to use slug?

// responsive belum

export default function OrderDone() {
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  const toggleTransaksi = () => {
    setIsTransaksiOpen(!isTransaksiOpen);
  };

  const toggleMyAccount = () => {
    setIsMyAccountOpen(!isMyAccountOpen);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      <div className="w-full max-w-6xl px-5">
        {/* Modal */}
        {/* Open the modal using document.getElementById('ID').showModal() method */}

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-white rounded-lg p-6 text-black relative">
            {/* Close (X) button in top-right corner */}
            <form method="dialog">
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                aria-label="Close"
              >
                ✕
              </button>
            </form>

            {/* Centered title */}
            <h3 className="font-bold text-xl text-center">Detail Transaksi</h3>
            <hr className="border-t border-gray-200 my-4 -mx-6" />

            <div className="text-black flex items-center space-x-3">
              <RiEBike2Line className="text-4xl" />
              <div className="flex items-center justify-between w-full">
                <h1 className="font-semibold">Kirim ke Alamat</h1>
                <span className="badge bg-green-100 text-green-400 border-0 font-semibold  rounded-xl">
                  Pesanan Selesai
                </span>
              </div>
            </div>
            <div className="space-y-4 mt-5">
              <div className="flex items-center justify-between text-sm">
                <h1 className="text-gray-500">No. Pesanan</h1>
                {/* No Pesanan di sini */}
                <h1 className="text-red-600 font-bold">O-250519-AGBZZFX</h1>
              </div>
              <div className="flex items-center justify-between text-sm">
                <h1 className="text-gray-500">Tanggal Pembelian</h1>
                <h1 className="text-gray-800">11 Mei 2025 - 13:31 WIB</h1>
              </div>
            </div>

            <hr className="border-t border-8 border-gray-100 mt-7 -mx-6" />

            <div className="mt-5">
              <h1 className="font-semibold">Detail Pesanan</h1>
            </div>
          </div>
        </dialog>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-5">
          {/* User Details */}
          <div className="hidden md:block md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-md font-semibold text-black">Nama Pengguna</h1>
            <div className="-mx-6 h-[0.5px] bg-gray-200 my-3" />

            {/* Transaksi Dropdown */}
            <div className="">
              <button
                onClick={toggleTransaksi}
                className="flex items-center justify-between w-full text-sm text-black font-semibold"
              >
                <span>Transaksi</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${isTransaksiOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTransaksiOpen && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link href="#" className="block text-sm text-gray-600 hover:text-black">
                    Terbuat
                  </Link>
                  <Link href="#" className="block text-sm text-gray-600 hover:text-black">
                    Menunggu Pembayaran
                  </Link>
                  <Link href="#" className="block text-sm text-gray-600 hover:text-black">
                    Sedang Diproses
                  </Link>
                  <Link href="#" className="block text-sm text-gray-600 hover:text-black">
                    Dikirim
                  </Link>
                  <Link href="/order-done" className="block text-sm text-gray-600 hover:text-black">
                    Selesai
                  </Link>
                  <Link href="#" className="block text-sm text-gray-600 hover:text-black">
                    Batal
                  </Link>
                </div>
              )}
            </div>

            <div className="-mx-6 h-[0.5px] bg-gray-200 my-3" />
            {/* My Account Dropdown */}
            <div className="">
              <button
                onClick={toggleMyAccount}
                className="flex items-center justify-between w-full text-sm text-black font-semibold"
              >
                <span>Akun Saya</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${isMyAccountOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
          </div>

          <div className="bg-white border rounded-lg px-5 pt-3 md:col-span-5 border-gray-200">
            <div className="overflow-x-auto -mx-5 px-5">
              {/* Order Status Tabs */}
              <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                {["Terbuat", "Menunggu Pembayaran", "Sedang Diproses", "Dikirim", "Selesai", "Batal"].map((status) => {
                  const isActive = status === "Terbuat";
                  return (
                    <button
                      key={status}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                        isActive
                          ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                          : "text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="-mx-5 h-[0.5px] bg-gray-200 my-3" />
            {/* If order is empty */}
            <div className="text-center space-y-4 py-3 pb-6">
              <h1 className="text-gray-500">Anda belum memiliki pesanan. Tunggu apa lagi, belanja sekarang.</h1>
              <button className="text-white bg-red-600 rounded-lg px-3 py-2">Yuk, belanja</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
