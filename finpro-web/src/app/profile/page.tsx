"use client";

import ImageUploadWidget from "@/features/admin/components/ImageUploadWidget";
import authStore from "../../zustand/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICloudinaryResult } from "@/types/products/product.image.type";
import { cloudinaryImageUpload } from "@/utils/products/product.image.helpers";
import { CloudinaryUploadWidget, CloudinaryUploadWidgetResults } from "@cloudinary-util/types";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ProfilePage() {
  const clearAuth = authStore((state) => state.clearAuth);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("auth-storage"); // <- dari authStore
    localStorage.removeItem("selectedStore");
    clearAuth();
    router.push("/login");
  };
  const [uploadedImage, setUploadedImage] = useState<ICloudinaryResult|null>(null);
  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    const newImage = cloudinaryImageUpload(result);
    if(newImage){
      setUploadedImage(newImage);
      toast.success("Image uploaded successfully");
    }else{
      toast.error("Image upload failed");
    }

  } 

  return (
    <div className="p-4">
      <h1 className="text-black text-xl mb-4">Profile</h1>
      <button onClick={handleSignOut} className="btn btn-primary">
        Logout
      </button>
      <Image src={uploadedImage?.secure_url ?? ""} alt="Profile Picture" width={200} height={200} className="mt-4 rounded-full mx-auto" />
      <ImageUploadWidget 
      uploadPreset="profile-upload"
      onSuccess={handleImageUpload}
      maxFiles={1}
      buttonText="Upload Profile Picture"
      />
    </div>
  );
}
