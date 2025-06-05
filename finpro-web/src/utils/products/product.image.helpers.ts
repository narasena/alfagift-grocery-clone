import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";

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

export const swapImages = <T extends ICloudinaryResult | IProductImage>(images: T[], index1: number, index2: number): T[] => {
  const newImages = [...images];
  const temp = newImages[index1];
  newImages[index1] = newImages[index2];
  newImages[index2] = temp;
  return newImages;
};