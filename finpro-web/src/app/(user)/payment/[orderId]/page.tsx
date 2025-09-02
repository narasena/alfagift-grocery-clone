"use client";

import useCheckout from "@/features/user/checkout/hooks/useCheckout";
import usePayment from "@/features/user/payment/hooks/usePayment";
import { EPaymentType } from "@/types/payment/payment.type";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const { handlePayment } = usePayment();
  const { priceBreakdown, selectedType, setSelectedType } = useCheckout();
  const router = useRouter();

  if (!priceBreakdown) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 bg-white">
      <h1 className="text-xl font-bold mb-4">Pilih Metode Pembayaran</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={() => setSelectedType("BANK_TRANSFER")}
          className={`w-full p-4 border rounded-xl text-left ${
            selectedType === "BANK_TRANSFER" ? "border-red-600 bg-red-50" : "border-gray-300"
          }`}
        >
          <p className="font-medium">Transfer Manual</p>
          <p className="text-sm text-gray-500">Transfer langsung</p>
        </button>

        <button
          onClick={() => setSelectedType("PAYMENT_GATEWAY")}
          className={`w-full p-4 border rounded-xl text-left ${
            selectedType === "PAYMENT_GATEWAY" ? "border-red-600 bg-red-50" : "border-gray-300"
          }`}
        >
          <p className="font-medium">Payment Gateway</p>
          <p className="text-sm text-gray-500">Bayar melalui kartu atau e-wallet</p>
        </button>
      </div>

      <div className="mt-auto pt-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Ringkasan</h2>
        <div className="w-full h-[2px] bg-gray-200 mb-4" />

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">Rp {priceBreakdown?.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Biaya Kirim</span>
          <span className="font-medium">Rp {priceBreakdown?.shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Diskon</span>
          <span className="font-medium">Rp {priceBreakdown?.discountedTotalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Diskon Ongkos Kirim</span>
          <span className="font-medium">Rp {priceBreakdown?.discountedTotalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-800 font-bold text-lg">Total</span>
          <span className="font-bold text-lg">Rp {priceBreakdown?.finalTotalAmount.toLocaleString()}</span>
        </div>

        {/* ke `/upload-payment/${paymentId}` */}
        <button
          onClick={async () => {
            const paymentMethod = selectedType === EPaymentType.BANK_TRANSFER ? "Mobile Banking" : "GoPay";
            const paymentId = await handlePayment(selectedType as EPaymentType, paymentMethod);

            router.push(`/upload-payment/${paymentId}`);
          }}
          disabled={!selectedType}
          className={`w-full py-3 rounded-4xl text-lg text-white font-bold ${
            selectedType ? "bg-red-600 hover:bg-red-700 focus:bg-red-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          BAYAR
        </button>
      </div>
    </div>
  );
}
