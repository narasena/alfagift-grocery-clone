import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import * as React from "react";

export interface IPaymentImageUploadButton {
  onSuccess: (result: CloudinaryUploadWidgetResults) => void;
  maxFiles: number;
  buttonText: string;
  uploadedImagesCount?: number;
}

export default function PaymentImageUploadWidget(props: IPaymentImageUploadButton) {
  return (
    <>
      <CldUploadWidget
        uploadPreset="payment-image"
        signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/signed-upload`}
        onSuccess={props.onSuccess}
        options={{
          sources: ["local", "url", "camera", "image_search", "google_drive"],
          multiple: true,
          maxFiles: props.maxFiles,
        }}
      >
        {({ open }) => (
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md"
            onClick={() => open?.()}
          >
            {props.buttonText}
          </button>
        )}
      </CldUploadWidget>
    </>
  );
}
