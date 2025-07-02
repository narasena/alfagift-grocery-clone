"use client";

import { TbCalendarTime } from "react-icons/tb";
import { RiEBike2Line } from "react-icons/ri";
import { IOrderCards } from "@/types/orders/orders.type";


export default function OrderCard({
  orderId,
  createdAt,
  latestStatus,
  firstName,
  lastName,
  numberOfProducts,
  finalTotalAmount
}: IOrderCards) {
  const openModal = () => {
    const modal = document.getElementById(`modal-${orderId}`) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-5 text-black mb-4">
      {/* Date and status */}
      <div className="flex items-center space-x-2">
        <TbCalendarTime className="text-lg text-gray-400" />
        <span className="text-sm text-gray-400">{createdAt}</span>
        <span className="badge bg-green-100 text-green-400 border-0 font-semibold px-4 py-2 rounded-xl">
          {latestStatus}
        </span>
      </div>

      {/* Order details */}
      <div className="mt-7 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <RiEBike2Line className="text-4xl" />
          <div>
            <h1>{firstName+" "+lastName}</h1>
            <h1 className="text-sm text-gray-500">No. Ref: {orderId}</h1>
          </div>
        </div>

        {/* Right side: total */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Belanja</p>
          <p className="text-sm font-semibold">{numberOfProducts} Produk</p>
          <p className="text-lg font-bold text-red-600">Rp {finalTotalAmount.toLocaleString()}</p>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      <div className="text-right">
        <button
          className="bg-white text-red-600 border border-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg"
          onClick={openModal}
        >
          Lihat Detail
        </button>
      </div>

      {/* Modal */}
      <dialog id={`modal-${orderId}`} className="modal">
        <div className="modal-box bg-white rounded-lg p-6 text-black relative">
          <form method="dialog">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </form>

          <h3 className="font-bold text-xl text-center">Detail Transaksi</h3>
          <hr className="border-t border-gray-200 my-4 -mx-6" />

          <div className="text-black flex items-center space-x-3">
            <RiEBike2Line className="text-4xl" />
            <div className="flex items-center justify-between w-full">
              <h1 className="font-semibold">Kirim ke Alamat</h1>
              <span className="badge bg-green-100 text-green-400 border-0 font-semibold rounded-xl">
                Pesanan {status}
              </span>
            </div>
          </div>

          <div className="space-y-4 mt-5">
            <div className="flex items-center justify-between text-sm">
              <h1 className="text-gray-500">No. Pesanan</h1>
              <h1 className="text-red-600 font-bold">{orderId}</h1>
            </div>
            <div className="flex items-center justify-between text-sm">
              <h1 className="text-gray-500">Tanggal Pembelian</h1>
              <h1 className="text-gray-800">{createdAt}</h1>
            </div>
          </div>

          <hr className="border-t border-8 border-gray-100 mt-7 -mx-6" />

          <div className="mt-5">
            <h1 className="font-semibold">Detail Pesanan</h1>
            {/* Add more detail content here */}
          </div>
        </div>
      </dialog>
    </div>
  );
}
