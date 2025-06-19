import { useProductImageShowing } from "@/features/admin/products/hooks/products/useProductImageShowing";
import { ICloudinaryResult } from "@/types/products/product.image.type";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import * as React from "react";
import { toast } from "react-toastify";
import { cloudinaryImageUpload, removeImage, setAsMainImage, swapImages } from "@/utils/products/product.image.helpers";

export const useProductImagesUpload = () => {
  const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
  const { imageShowing, setImageShowing, handleImageClick } = useProductImageShowing();
  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    const newImage = cloudinaryImageUpload(result);
    if (newImage) {
      setUploadedImages((prevImages) => {
        if (prevImages.length === 0) {
          return setAsMainImage([newImage], newImage) as ICloudinaryResult[];
        }
        return setAsMainImage([...prevImages, newImage], newImage);
      });

      toast.success(`Image uploaded successfully!`);
    } else {
      toast.error("Error uploading image. Please try again.");
    }
  };
  const handleSetAsMainImage = () => {
    if (!imageShowing) return;
    setUploadedImages((prevImages) => setAsMainImage(prevImages, imageShowing as ICloudinaryResult));
  };
  const handleSwapImage = (index1: number, index2: number) => {
    setUploadedImages((prevImages) => {
      // First swap the images
      const swappedImages = swapImages(prevImages, index1, index2);

      // If one of the swapped positions is the main image position (index 0),
      // we need to update the isMainImage flags
      if (index1 === 0 || index2 === 0) {
        // Make sure the image at index 0 is the main image
        return swappedImages.map((img, idx) => ({
          ...img,
          isMainImage: idx === 0,
        }));
      }

      // If we're not swapping with the main image position, just return the swapped array
      return swappedImages;
    });
  };

  const handleDeleteImage = (public_id: string) => {
    setUploadedImages((prevImages) => {
      return removeImage(prevImages, public_id);
    });
  };

  React.useEffect(() => {
    if (uploadedImages.length > 0) {
      setImageShowing(uploadedImages[0]);
    }
    console.log("Uploaded Images:", uploadedImages);
  }, [uploadedImages]);

  return {
    imageShowing,
    handleImageClick,
    uploadedImages,
    setUploadedImages,
    handleSwapImage,
    handleSetAsMainImage,
    handleImageUpload,
    handleDeleteImage,
  };
};
