import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import * as React from 'react';
import { useProductImagesUpload } from '../add/hooks/useProductImagesUpload';

export interface IProductImageUploadButton {
    uploadePreset: string
    onSuccess: (result: CloudinaryUploadWidgetResults) => void
    maxFiles: number
    buttonText: string
}

export default function ProductImageUploadButton(props: IProductImageUploadButton) {
  return (
    <>
      <CldUploadWidget
        uploadPreset={props.uploadePreset}
        signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/signed-upload`}
        onSuccess={props.onSuccess}
        options={{
          sources: ["local", "url", "camera"],
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
