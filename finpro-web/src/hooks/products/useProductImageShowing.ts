import { IProductImage } from "@/types/products/product.image.type";
import * as React from "react";

export const useProductImageShowing = () => {
    const [imageShowing, setImageShowing] = React.useState<IProductImage | null>(null);
    const handleImageClick = (image: IProductImage) => setImageShowing(image);
    return {
        imageShowing,
        setImageShowing,
        handleImageClick
    }
    
}