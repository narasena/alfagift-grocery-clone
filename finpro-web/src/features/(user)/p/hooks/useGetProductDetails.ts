import * as React from "react";
import { IProductDetails } from "@/types/products/product.type";
import { IProductImage } from "@/types/products/product.image.type";
import { useParams } from "next/navigation";
import apiInstance from "@/utils/apiInstance";
import { getProductDetails } from "../api/handleGetProductDetails";

export default function useGetProductDetails(slug: string) {
  const params = useParams();

  const [product, setProduct] = React.useState<IProductDetails | null>(null);
  const [imageShowing, setImageShowing] = React.useState<IProductImage | null>(null);
  const handleGetProductDetails = async () => {
    try {
      if (params.slug) {
        const response = await getProductDetails(params.slug as string);
        setProduct(response.data.product);
        setImageShowing(response.data.product.productImage[0]);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  React.useEffect(() => {
    handleGetProductDetails();
  }, []);
  return {
    product,
    imageShowing,
    setImageShowing,
  };
}
