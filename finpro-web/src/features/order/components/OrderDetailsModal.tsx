"use client";

import * as React from "react";
import { OrderDetailsModalProps } from "@/types/orders/orders.type";

export default function OrderDetailsModal({ isOpen, onClose, orderDetails }: OrderDetailsModalProps) {
  const [isItemsOpen, setIsItemsOpen] = React.useState(false);

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
      <div className="modal-box bg-white rounded-lg p-6 text-black relative max-w-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="font-bold text-lg mb-6">Detail Transaksi</h3>

        {/* Status & Address */}
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-base">Kirim ke Alamat</h5>
          <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
            Pesanan Dibatalkan
          </span>
        </div>

        {/* Order Info */}
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">No. Pesanan</span>
            <span className="font-semibold">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Pembelian</span>
            <span className="font-semibold">{new Date(orderDetails.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Detail Pesanan */}
        <h4 className="font-semibold text-base mb-3">Detail Pesanan</h4>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 text-sm">Pengiriman</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">{orderDetails.orderItems?.length} Pengiriman</span>
            <button onClick={() => setIsItemsOpen(!isItemsOpen)} className="text-blue-600 ml-2">
              {isItemsOpen ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {/* Items */}
        {isItemsOpen && (
          <ul className="space-y-3 border-t pt-4 mb-6">
            {orderDetails.orderItems.map((item: any, index: any) => (
              <li key={index} className="flex justify-between items-start border rounded-lg p-3">
                <div>
                  <p className="font-medium text-black text-sm mb-1">{item.productName}</p>
                  <p className="text-xs text-gray-500">Jumlah: {item.quantity}</p>
                </div>
                <div className="text-right">
                  {item.discountedPrice !== item.originalPrice && (
                    <p className="text-[11px] line-through text-gray-400">
                      Rp {item.originalPrice.toLocaleString("id-ID")}
                    </p>
                  )}
                  <p className="text-red-600 font-bold text-sm">Rp {item.finalPrice.toLocaleString("id-ID")}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Info Pengiriman */}
        <h4 className="font-semibold text-base mb-2">Info Pengiriman</h4>
        <div className="space-y-1 text-sm mb-6">
          <p className="text-gray-500">Toko Pengirim:</p>
          <p className="font-semibold">{orderDetails.store?.name}</p>
          {orderDetails.store?.phoneNumber && <p>{orderDetails.store?.phoneNumber}</p>}
        </div>

        {/* Alamat */}
        <h4 className="font-semibold text-base mb-2">Alamat Tujuan</h4>
        <div className="space-y-1 text-sm mb-6">
          <p className="font-semibold">
            {orderDetails.user?.firstName} {orderDetails.user?.lastName}
          </p>
          <p className="font-semibold">{orderDetails.user?.phoneNumber}</p>
          <p className="text-gray-700">{orderDetails.shippingAddress}</p>
        </div>

        {/* Ringkasan */}
        <h4 className="font-semibold text-base mb-2">Ringkasan Pembayaran</h4>
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
          <div className="flex justify-between font-bold text-base">
            <span>Total Bayar</span>
            <span className="text-red-600">Rp {orderDetails.totalToBePaid?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
