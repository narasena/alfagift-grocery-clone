import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

export function cloudinaryImageUpload (result: CloudinaryUploadWidgetResults) {
  if (result.info && typeof result.info === 'object' && 'public_id' in result.info && 'secure_url' in result.info) {
    const newImage = {
      public_id: result.info.public_id as string,
      secure_url: result.info.secure_url as string,
      isMainImage: false,
    };
    return newImage;
  }
};
export function setAsMainImage<T extends ICloudinaryResult | IProductImage>(
  images: T[],
  imageShowing: T
): T[] {
  const selectedIndex = images.findIndex(
    (img) => {
      // For ICloudinaryResult type
      if ('secure_url' in img && 'secure_url' in imageShowing) {
        return img.secure_url === imageShowing.secure_url;
      }
      // For IProductImage type
      if ('imageUrl' in img && 'imageUrl' in imageShowing) {
        return img.imageUrl === imageShowing.imageUrl;
      }
      return false;
    }
  );
  
  if (selectedIndex === -1) return images;
  
  const newImages = [...images];
  const selectedImage = { ...newImages[selectedIndex], isMainImage: true };
  newImages.splice(selectedIndex, 1);
  
  return [
    selectedImage as T,
    ...newImages.map((img) => ({ ...img, isMainImage: false } as T)),
  ];
};

export const swapImages = <T>(images: T[], index1: number, index2: number): T[] => {
  const newImages = [...images];
  const temp = newImages[index1];
  newImages[index1] = newImages[index2];
  newImages[index2] = temp;
  return newImages;
};

export const removeImage = <T extends ICloudinaryResult | IProductImage>(images: T[], public_id: string): T[] => {
  const updatedImages = images.filter((image) => {
    if ('public_id' in image) return image.public_id! !== public_id;
    return image?.cldPublicId !== public_id;
  });
  return updatedImages;
};