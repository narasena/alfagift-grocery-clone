import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import * as React from "react";

export const useProductImageShowing = () => {
    const [imageShowing, setImageShowing] = React.useState<IProductImage | ICloudinaryResult | null>(null);
    const handleImageClick = (image: IProductImage | ICloudinaryResult) => setImageShowing(image);
  return {
    imageShowing,
    setImageShowing,
    handleImageClick,
  };
};
