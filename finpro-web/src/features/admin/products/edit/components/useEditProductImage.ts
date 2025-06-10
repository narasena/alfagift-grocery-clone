import * as React from "react";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import { useProductImageShowing } from "@/hooks/products/useProductImageShowing";
import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import { toast } from "react-toastify";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { cloudinaryImageUpload, removeImage, setAsMainImage, swapImages } from "@/utils/products/product.image.helpers";

type TImageItem = { type: "existing"; data: IProductImage } | { type: "new"; data: ICloudinaryResult };

export const useEditProductImage = () => {
  const { product } = useProductDetails();
  const [allImagesList, setAllImagesList] = React.useState<TImageItem[]>([]);
  const [imageList, setImageList] = React.useState<IProductImage[]>(product?.productImage ?? []);
  const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
  const MAX_IMAGES = 5;
  const { imageShowing, setImageShowing, handleImageClick } = useProductImageShowing();

  React.useEffect(() => {
    if (product) {
      const existingImages: TImageItem[] = product.productImage.map((image) => ({ type: "existing", data: image }));
      const newImages: TImageItem[] = uploadedImages.map((image) => ({ type: "new", data: image }));
      
      const sortedImages = [...existingImages, ...newImages].sort((a, b) => {
        if ('isMainImage' in a.data && a.data.isMainImage) return -1
        if ('isMainImage' in b.data && b.data.isMainImage) return 1
        if ('updatedAt' in a.data && 'updatedAt' in b.data) {
          return new Date(b.data.updatedAt).getTime() - new Date(a.data.updatedAt).getTime();
        }
        return 0;
      });
      setAllImagesList(sortedImages);
    }
  }, [product, uploadedImages]);

  const handleImageUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (MAX_IMAGES - imageList.length > 0 && uploadedImages.length <= MAX_IMAGES) {
      const newImage = cloudinaryImageUpload(result);
      if (newImage) {
        toast.success("Image uploaded successfully");
      }
    } else {
      toast.error("You can't upload more images. Maximum number of image reached.");
    }
  };

  const handleSetAsMainImage = () => {
    if (!imageShowing) return;
    setAllImagesList(prevImages => {
      return prevImages.map((img) => {
        if (img.type === "existing" && "id" in imageShowing && img.data.id === imageShowing.id) {
          // For existing images
          return {
            type: "existing",
            data: { ...img.data, isMainImage: true },
          } as TImageItem;
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
    });
  };

  const handleSwapImage = (index1:number, index2:number) => {
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
  }

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
      if (targetIndex === -1) return prevImages

      const isDeleteMainImage = targetIndex === 0 ||
        ('isMainImage' in prevImages[targetIndex].data && prevImages[targetIndex].data.isMainImage)
      
      const newImages = [...prevImages]
      newImages.splice(targetIndex, 1)

      if (isDeleteMainImage && newImages.length > 0) {
        return newImages.map((img, idx) => {
          if(idx === 0) {
            return {
              type: img.type,
              data: { ...img.data, isMainImage: true }
            } as TImageItem
          } else {
            return {
              type: img.type,
              data: {
                ...img.data,
                isMainImage: false
          }
            } as TImageItem
          }
        })
      }
      
      return newImages
      })
    }

  const saveChanges = () => {
    const existingImages = allImagesList
      .filter(img => img.type === "existing")
      .map(img => img.data as IProductImage)
    
    const newUploads = allImagesList
      .filter(img => img.type === "new")
      .map(img => img.data as ICloudinaryResult)
  }

  return {};
};
