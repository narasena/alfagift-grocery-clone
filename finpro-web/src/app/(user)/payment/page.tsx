"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const subtotal = 500_000; // Example value
  const total = 500_000; // Example value

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 bg-white">
      <h1 className="text-xl font-bold mb-4">Pilih Metode Pembayaran</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={() => setSelectedMethod("manual")}
          className={`w-full p-4 border rounded-xl text-left ${
            selectedMethod === "manual" ? "border-red-600 bg-red-50" : "border-gray-300"
          }`}
        >
          <p className="font-medium">Transfer Manual</p>
          <p className="text-sm text-gray-500">Transfer langsung</p>
        </button>

        <button
          onClick={() => setSelectedMethod("gateway")}
          className={`w-full p-4 border rounded-xl text-left ${
            selectedMethod === "gateway" ? "border-red-600 bg-red-50" : "border-gray-300"
          }`}
        >
          <p className="font-medium">Payment Gateway</p>
          <p className="text-sm text-gray-500">Bayar melalui kartu atau e-wallet</p>
        </button>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-800 font-semibold">Biaya Kirim</span>
          <span className="font-bold text-lg">Rp 0</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-800 font-semibold">Diskon</span>
          <span className="font-bold text-lg">Rp 0</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-800 font-semibold">Total</span>
          <span className="font-bold text-lg">Rp {total.toLocaleString()}</span>
        </div>

        <button
          disabled={!selectedMethod}
          className={`w-full py-3 rounded-3xl text-white font-bold ${
            selectedMethod ? "bg-red-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          BAYAR
        </button>
      </div>
    </div>
  );
}
