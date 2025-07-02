"use client";

import * as React from "react";
import { OrderDetailsModalProps } from "@/types/orders/orders.type";

export default function OrderDetailsModal({ isOpen, onClose, orderDetails }: OrderDetailsModalProps) {
  React.useEffect(() => {
    const modal = document.getElementById(`order-details-modal`) as HTMLDialogElement | null;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

  if (!orderDetails) return null;

  return (
    <dialog id="order-details-modal" className="modal">
      <div className="modal-box bg-white rounded-lg p-6 text-black relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-4">Detail Transaksi</h3>

        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold">Kirim ke Alamat</h5>
          <span className="badge bg-gray-200 text-gray-600 border-0 font-semibold px-3 py-1 rounded-xl">
            Pesanan Dibatalkan
          </span>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">No. Pesanan</span>
            <span className="font-semibold">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Pembelian</span>
            <span className="font-semibold">{new Date(orderDetails.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <h4 className="font-semibold mb-2">Detail Pesanan</h4>
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Pengiriman</span>
            <span>{orderDetails.orderItems?.length} Pengiriman</span>
          </div>
        </div>

        <h4 className="font-semibold mb-2">Info Pengiriman</h4>
        <div className="space-y-1 text-sm mb-4">
          <p className="text-gray-500">Toko Pengirim :</p>
          <p className="font-semibold">{orderDetails.store?.name}</p>
          <p>{orderDetails.store?.phoneNumber}</p>
        </div>

        <h4 className="font-semibold mb-2">Alamat Tujuan</h4>
        <div className="space-y-1 text-sm mb-6">
          <p className="font-semibold">
            {orderDetails.user?.firstName} {orderDetails.user?.lastName}
          </p>
          <p className="font-semibold">{orderDetails.user?.phoneNumber}</p>
          <p>{orderDetails.shippingAddress}</p>
        </div>

        <h4 className="font-semibold mb-2">Ringkasan Pembayaran</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Belanja</span>
            <span className="font-semibold">Rp {orderDetails.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Diskon</span>
            <span>Rp {orderDetails.totalDiscount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Ongkos Kirim</span>
            <span>Rp {orderDetails.totalShippingCost?.toLocaleString()}</span>
          </div>
          <hr className="border-t border-gray-200 my-2" />
          <div className="flex justify-between font-bold">
            <span>Total Bayar</span>
            <span className="text-red-600">Rp {orderDetails.totalToBePaid?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
