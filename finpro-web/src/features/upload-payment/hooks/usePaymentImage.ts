import * as React from "react";
import { ICloudinaryResult } from "@/types/products/product.image.type";
import { cloudinaryImageUpload } from "@/utils/products/product.image.helpers";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useState } from "react";
import { toast } from "react-toastify";
import { handlePaymentUpload } from "../api/handlePaymentUpload";
import useAuthStore from "@/zustand/authStore";
import { useParams } from "next/navigation";
import {  AxiosError } from "axios";

export default function usePaymentImage() {
  // const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<ICloudinaryResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const { paymentId } = useParams();

  console.log("Uploaded Images:", uploadedImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let response = {};
      if (token && paymentId && uploadedImage) {
        const imageUrl = uploadedImage.secure_url;
        const cldPublicId = uploadedImage.public_id;
        response = await handlePaymentUpload(token, String(paymentId), imageUrl, cldPublicId);
        console.log(response);
        toast.success("Payment proof uploaded successfully! Please wait for confirmation.");
      }
    } catch (error) {
      const errRes = error as AxiosError<{ message: string }>;
      toast.error(errRes.response?.data.message || "Failed to upload image");
      console.error("Error uploading image:", errRes);
    }
  };

  const handleImageUpload = async (result: CloudinaryUploadWidgetResults) => {
    const newImage = cloudinaryImageUpload(result);
    // const imageUrl = newImage?.secure_url;
    // const cldPublicId = newImage?.public_id;

    if (newImage) {
      setUploadedImage(newImage);
    } else {
      toast.error("Error uploading image. Please try again.");
    }
  };
  return {
    previewUrl,
    handleFileChange,
    handleSubmit,
    handleImageUpload,
    uploadedImage,
  };
}
