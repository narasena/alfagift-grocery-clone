import apiInstance from "@/services/apiInstance";
import { IProductCategory, IProductSubCategory } from "@/types/products/product.category.type";
import * as React from "react";

export const useProductCategories = () => {
  const [productCategories, setProductCategories] = React.useState<IProductCategory[]>([]);
  const [productSubCategories, setProductSubCategories] = React.useState<IProductSubCategory[]>([]);

  const handleGetProductCategories = async () => {
    try {
      const categoryResponse = await apiInstance.get("/product-category");
      const subCategoryResponse = await apiInstance.get("/product-category/subcategories");
      setProductCategories(categoryResponse.data.productCategories);
      setProductSubCategories(subCategoryResponse.data.productSubCategories);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  React.useEffect(() => {
    handleGetProductCategories();
  }, []);
  return {
    productCategories,
    productSubCategories,
  };
};
