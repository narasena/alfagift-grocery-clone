import * as React from "react";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import { useProductImageShowing } from "@/hooks/products/useProductImageShowing";
import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import { toast } from "react-toastify";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { cloudinaryImageUpload } from "@/utils/products/product.image.helpers";

type TImageItem = { type: "existing"; data: IProductImage } | { type: "new"; data: ICloudinaryResult };

export const useEditProductImage = () => {
  const { product } = useProductDetails();
  const [allImagesList, setAllImagesList] = React.useState<TImageItem[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
  const MAX_IMAGES = 5;
  const { imageShowing, setImageShowing, handleImageClick } = useProductImageShowing();

  React.useEffect(() => {
    if (product) {
      const existingImages: TImageItem[] = product.productImage.map((image) => ({ type: "existing", data: image }));
      setAllImagesList(existingImages);
      if (existingImages.length > 0 && !imageShowing) setImageShowing(existingImages[0].data);
    }
  }, [product]);

  React.useEffect(() => {
    if (uploadedImages.length > 0 && uploadedImages.length < MAX_IMAGES) {
      setAllImagesList((prevList) => {
        const existingOnly = prevList.filter((item) => item.type === "existing");
        const newImages: TImageItem[] = uploadedImages.map((image) => ({ type: "new", data: image }));

        return [...existingOnly, ...newImages].sort((a, b) => {
          if ("isMainImage" in a.data && a.data.isMainImage) return -1;
          if ("isMainImage" in b.data && b.data.isMainImage) return 1;
          if ("updatedAt" in a.data && "updatedAt" in b.data) {
            return new Date(b.data.updatedAt).getTime() - new Date(a.data.updatedAt).getTime();
          }
          return 0;
        });
      });
    }
  }, [uploadedImages]);

  React.useEffect(() => {
    if (allImagesList.length > 0 && !imageShowing) setImageShowing(allImagesList[0].data)
    if (imageShowing && allImagesList.length > 0) {
      const imageStillExists = allImagesList.some(img => {
        if (img.type === "existing" && "id" in imageShowing && img.data.id === imageShowing.id) return true
        else if (img.type === "new" && "public_id" in imageShowing && img.data.public_id === imageShowing.public_id) return true
        return false
      })
      if (!imageStillExists) setImageShowing(allImagesList[0].data)
    }
    if(allImagesList.length === 0) setImageShowing(null)
  }, [allImagesList])
  
  const handleImageUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (MAX_IMAGES - allImagesList.length > 0 && uploadedImages.length <= MAX_IMAGES) {
      const newImage = cloudinaryImageUpload(result);
      if (newImage) {
        setUploadedImages((prevImages) => [...prevImages, newImage]);
        toast.success("Image uploaded successfully");
      }
    } else {
      toast.error("You can't upload more images. Maximum number of image reached.");
    }
  };

  const handleSetAsMainImage = () => {
    if (!imageShowing) return;
    setAllImagesList((prevImages) => {
      const updatedImages = prevImages.map((img) => {
        if (img.type === "existing" && "id" in imageShowing && img.data.id === imageShowing.id) {
          // For existing images
          return {
            type: "existing",
            data: { ...img.data, isMainImage: true },
          } as TImageItem

        } else if (img.type === "new" && "public_id" in imageShowing && img.data.public_id === imageShowing.public_id) {
          // For new images
          return {
            type: "new",
            data: { ...img.data, isMainImage: true },
          } as TImageItem;
        } else {
          // For all other images
          return {
            type: img.type,
            data: { ...img.data, isMainImage: false },
          } as TImageItem;
        }
      });
      const newMainImage = updatedImages.find((img) => img.data.isMainImage === true)

      if (!newMainImage) return updatedImages
      const otherImages = updatedImages.filter((img) => img !== newMainImage)
      
      console.log([newMainImage, ...otherImages])
      return [newMainImage, ...otherImages]
    });
  };

  const handleSwapImage = (index1: number, index2: number) => {
    setAllImagesList((prevImages) => {
      // Create a new array with the swapped items
      const newImages = [...prevImages];
      const temp = newImages[index1];
      newImages[index1] = newImages[index2];
      newImages[index2] = temp;

      // If one of the swapped images is at index 0, update isMainImage
      if (index1 === 0 || index2 === 0) {
        return newImages.map((img, idx) => {
          if (img.type === "existing") {
            return {
              type: "existing" as const,
              data: { ...img.data, isMainImage: idx === 0 },
            };
          } else {
            return {
              type: "new" as const,
              data: { ...img.data, isMainImage: idx === 0 },
            };
          }
        }) as TImageItem[];
      }

      return newImages;
    });
  };

  const handleDeleteImage = (public_id: string) => {
    setAllImagesList((prevImages) => {
      const targetIndex = prevImages.findIndex((img) => {
        if (img.type === "existing" && "cldPublicId" in img.data && img.data.cldPublicId === public_id) {
          return true;
        } else if (img.type === "new" && "public_id" in img.data && img.data.public_id === public_id) {
          return true;
        }
        return false;
      });
      if (targetIndex === -1) return prevImages;

      const isDeleteMainImage =
        targetIndex === 0 ||
        ("isMainImage" in prevImages[targetIndex].data && prevImages[targetIndex].data.isMainImage);

      const newImages = [...prevImages];
      newImages.splice(targetIndex, 1);

      if (isDeleteMainImage && newImages.length > 0) {
        return newImages.map((img, idx) => {
          if (idx === 0) {
            return {
              type: img.type,
              data: { ...img.data, isMainImage: true },
            } as TImageItem;
          } else {
            return {
              type: img.type,
              data: {
                ...img.data,
                isMainImage: false,
              },
            } as TImageItem;
          }
        });
      }

      return newImages;
    });
  };

  const isThumbnailSameWithImageShowing = (image: TImageItem, currentShowing: IProductImage|ICloudinaryResult) => {
    if (!currentShowing) return false
    if ("cldPublicId" in image.data && "cldPublicId" in currentShowing) {
      return image.data.cldPublicId === currentShowing.cldPublicId
    } else if ("public_id" in image.data && "public_id" in currentShowing) {
      return image.data.public_id === currentShowing.public_id
    }
    return false
 
  }

  return {
    product,
    allImagesList,
    uploadedImages,
    handleImageClick,
    handleImageUploadSuccess,
    handleSetAsMainImage,
    handleSwapImage,
    handleDeleteImage,
    imageShowing,
    setImageShowing,
    isThumbnailSameWithImageShowing
  };
};
