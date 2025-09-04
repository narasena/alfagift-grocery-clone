"use client";
import usePickStoreId from "@/hooks/stores/usePickStoreId";
import { IProductDetails } from "@/types/products/product.type";
import apiInstance from "@/utils/api/apiInstance";
import React from "react";

export default function useDisplayedProducts() {
  const { storeId } = usePickStoreId();
  const [displayedProducts, setDisplayedProducts] = React.useState<IProductDetails[]>([]);

  const fetchDisplayedProducts = async () => {
    try {
      console.log(storeId);
      const response = await apiInstance.get("/product/displayed/" + storeId);
      console.log(response);
      setDisplayedProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching displayed products:", error);
    }
  };

  React.useEffect(() => {
    if (storeId) {
      fetchDisplayedProducts();
    }
  }, [storeId]);

  return {
    displayedProducts,
    setDisplayedProducts,
  };
}
