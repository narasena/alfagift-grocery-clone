"use client";

import PaymentImageUploadWidget from "@/features/user/upload-payment/components/PaymentImageUploadWidget";
import usePaymentImage from "@/features/user/upload-payment/hooks/usePaymentImage";
import { CldImage } from "next-cloudinary";

export default function UploadPaymentPage() {
  const { previewUrl, handleImageUpload, uploadedImage, handleSubmit } = usePaymentImage();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black">Upload Payment Receipt</h1>
        {uploadedImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Uploaded Image:</p>
            <CldImage
              src={uploadedImage.secure_url}
              alt="Uploaded Receipt"
              width={300}
              height={300}
              className="mt-2 rounded-md max-h-64 object-contain"
            />
          </div>
        )}
        <div className="space-y-4">
          <PaymentImageUploadWidget onSuccess={handleImageUpload} maxFiles={1} buttonText="Upload Payment Image" />
          {previewUrl && (
            <img src={previewUrl} alt="Receipt Preview" className="mt-4 rounded-md max-h-64 object-contain" />
          )}
        </div>
        <div>
          <button
            className="my-3 bg-red-600 font font-medium text-xl text-white p-4 size-max rounded-md hover:bg-red-500"
            onClick={handleSubmit}
          >
            Submit Image
          </button>
        </div>
      </div>
    </main>
  );
}
