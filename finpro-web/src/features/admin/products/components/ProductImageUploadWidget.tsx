import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import * as React from "react";
import { RiImageAddFill } from "react-icons/ri";

export interface IProductImageUploadButton {
  uploadePreset: string;
  onSuccess: (result: CloudinaryUploadWidgetResults) => void;
  maxFiles: number;
  buttonText: string;
  uploadedImagesCount?: number;
  type: "button" | "thumbnails";
}

export default function ProductImageUploadWidget(props: IProductImageUploadButton) {
  return (
    <>
      <CldUploadWidget
        uploadPreset={props.uploadePreset}
        signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/signed-upload`}
        onSuccess={props.onSuccess}
        options={{
          sources: ["local", "url", "camera", "image_search", "google_drive"],
          multiple: true,
          maxFiles: props.maxFiles,
        }}
      >
        {({ open }) =>
          props.type === "button" ? (
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md"
              onClick={() => open?.()}
            >
              {props.buttonText}
            </button>
          ) : (
            Array(5 - (props.uploadedImagesCount ?? 0))
              .fill(null)
              .map((_, indx) => (
                <div key={indx} className="relative !cursor-pointer">
                  <button
                    type="button"
                    className="max-lg:size-18 lg:size-28 border border-gray-400 bg-gray-100 rounded-md centered overflow-hidden"
                    onClick={() => open?.()}
                  >
                    <RiImageAddFill className="text-gray-400 size-10" />
                  </button>
                </div>
              ))
          )
        }
      </CldUploadWidget>
    </>
  );
}
