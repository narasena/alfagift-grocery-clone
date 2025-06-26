"use client";

import PaymentImageUploadWidget from "@/features/upload-payment/components/PaymentImageUploadWidget";
import usePaymentImage from "@/features/upload-payment/hooks/usePaymentImage";

export default function UploadPaymentPage() {
  const { previewUrl, handleImageUpload } = usePaymentImage();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black">Upload Payment Receipt</h1>
        <div className="space-y-4">
          <PaymentImageUploadWidget onSuccess={handleImageUpload} maxFiles={1} buttonText="Upload Payment Image" />
          {previewUrl && (
            <img src={previewUrl} alt="Receipt Preview" className="mt-4 rounded-md max-h-64 object-contain" />
          )}
        </div>
      </div>
    </main>
  );
}
