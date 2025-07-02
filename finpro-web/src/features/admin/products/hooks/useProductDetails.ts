import { IProductDetails } from "@/types/products/product.type";
import { useParams } from "next/navigation";
import * as React from "react";
import { useProductImageShowing } from "./useProductImageShowing";
import { getProductDetails } from "@/features/user/slug pages/product/getProductDetails";
import storeLocationStore from "@/zustand/storeLocation.store";
import { IProductImage } from "@/types/products/product.image.type";

export const useProductDetails = () => {
  const params = useParams();
  const { imageShowing, setImageShowing, handleImageClick } = useProductImageShowing();
  const [product, setProduct] = React.useState<IProductDetails | null>(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const storeId = storeLocationStore((state) => state.storeId);

  const handleGetProductDetails = async () => {
    try {
      const productData = await getProductDetails(params.slug as string, storeId!);
      console.log(productData);
      setProduct(productData!);
      setImageShowing(productData?.productImage.find((image: IProductImage) => image.isMainImage === true) || null);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const refreshProductDetails = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (storeId ) {
      handleGetProductDetails();
    }
  }, [refreshTrigger, storeId]);

  return {
    product,
    imageShowing,
    handleImageClick,
    refreshProductDetails,
  };
};
