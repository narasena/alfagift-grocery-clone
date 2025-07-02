"use client";

import { TbCalendarTime } from "react-icons/tb";
import { RiEBike2Line } from "react-icons/ri";
import { OrderCardProps } from "@/types/orders/orders.type";
import { getStatusLabel } from "@/utils/order/statusLabes";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function OrderCard({
  orderId,
  createdAt,
  latestStatus,
  firstName,
  lastName,
  numberOfProducts,
  finalTotalAmount,
  onDetailClick,
}: OrderCardProps) {
  const openModal = () => {
    if (onDetailClick) {
      onDetailClick(orderId); // you pass orderId ✅
    }

    const modal = document.getElementById(`modal-${orderId}`) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const prettyStatus = getStatusLabel(latestStatus);

  let formattedCreatedAt = createdAt;
  try {
    formattedCreatedAt = format(parseISO(createdAt), "dd MMMM yyyy - HH:mm 'WIB'", {
      locale: idLocale,
    });
  } catch (error) {
    console.error("Invalid date:", createdAt);
  }

  return (
    <div className="rounded-lg border border-gray-200 p-5 text-black mb-4">
      {/* Date and status */}
      <div className="flex items-center space-x-2">
        <TbCalendarTime className="text-lg text-gray-400" />
        <span className="text-sm text-gray-400">{formattedCreatedAt}</span>
        <span className="badge bg-green-100 text-green-400 border-0 font-semibold px-4 py-2 rounded-xl">
          {prettyStatus}
        </span>
      </div>

      {/* Order details */}
      <div className="mt-7 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <RiEBike2Line className="text-4xl" />
          <div>
            <h1>
              {firstName} {lastName}
            </h1>

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
      {/* <dialog id={`modal-${orderId}`} className="modal">
        <div className="modal-box bg-white rounded-lg p-6 text-black relative">
          <form method="dialog">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </form>

          <h3 className="font-bold text-xl mb-4">Detail Transaksi</h3>

          <h4 className="font-semibold mb-2">Delivery</h4>
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold">Kirim ke Alamat</h5>
            <span className="badge bg-gray-200 text-gray-600 border-0 font-semibold px-3 py-1 rounded-xl">
              Pesanan Dibatalkan
            </span>
          </div>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">No. Pesanan</span>
              <span className="font-semibold">O-250630-AGYTNHS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal Pembelian</span>
              <span className="font-semibold">30 Jun 2025 - 12:53 WIB</span>
            </div>
          </div>

          <h4 className="font-semibold mb-2">Detail Pesanan</h4>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Pengiriman</span>
              <span>1 Pengiriman</span>
            </div>
          </div>

          <h4 className="font-semibold mb-2">Info Pengiriman</h4>
          <div className="space-y-1 text-sm mb-4">
            <p className="text-gray-500">Toko Pengirim :</p>
            <p className="font-semibold">TI17 - DS BSD</p>
            <p>081117049937</p>
          </div>

          <h4 className="font-semibold mb-2">Alamat Tujuan</h4>
          <div className="space-y-1 text-sm mb-6">
            <p className="font-semibold">Nama Penerima</p>
            <p className="font-semibold">0812xxxxxxx</p>
            <p>Alamat Lengkap Penerima</p>
          </div>

          <h4 className="font-semibold mb-2">Ringkasan Pembayaran</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Belanja</span>
              <span className="font-semibold">Rp 20.100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Diskon</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Ongkos Kirim</span>
              <span>Rp 0</span>
            </div>
            <hr className="border-t border-gray-200 my-2" />
            <div className="flex justify-between font-bold">
              <span>Total Bayar</span>
              <span className="text-red-600">Rp 20.100</span>
            </div>
          </div>
        </div>
      </dialog> */}
    </div>
  );
}
