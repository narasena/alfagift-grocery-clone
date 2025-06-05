import apiInstance from "@/utils/api/apiInstance";
import { getProductDetails } from "@/services/products/getProductDetails";
import { IProductDetails } from "@/types/products/product.type";
import { useParams } from "next/navigation";
import * as React from "react";

export default function EditProductSlugPage() {
  const params = useParams();
  const [product, setProduct] = React.useState<IProductDetails | null>(null);
  const handleGetProduct = async () => {
    try {
      const productData = await getProductDetails(params.slug as string);
      setProduct(productData!);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  React.useEffect(() => {
    handleGetProduct();
  }, []);

  return <div>page</div>;
}
