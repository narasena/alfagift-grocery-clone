import * as React from "react";
import authStore from "@/zustand/store";
import { ICloudinaryResult } from "@/types/products/product.image.type";
import { cloudinaryImageUpload } from "@/utils/products/product.image.helpers";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useState } from "react";
import { toast } from "react-toastify";

export default function usePaymentImage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<ICloudinaryResult[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  console.log("Uploaded Images:", uploadedImages);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");

    const formData = new FormData();
    formData.append("receipt", file);

    // Replace with actual backend endpoint
    const res = await fetch("/api/upload-receipt", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Receipt uploaded successfully!");
    } else {
      alert("Failed to upload receipt.");
    }
  };

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    const newImage = cloudinaryImageUpload(result);
    if (newImage) {
      setUploadedImages((prevImages) => [...prevImages, newImage]);

      toast.success(`Image uploaded successfully!`);
    } else {
      toast.error("Error uploading image. Please try again.");
    }
  };
  return {
    previewUrl,
    handleFileChange,
    handleSubmit,
    handleImageUpload,
  };
}
