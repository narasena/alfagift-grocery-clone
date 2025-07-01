import * as React from "react";
import {  IProductCategoryResponse,  IProductDetailsCategoryResponse,  IProductSubCategoryResponse } from "@/types/products/product.category.type";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import apiInstance from "@/utils/api/apiInstance";
import usePickStoreId from "@/hooks/stores/usePickStoreId";

export const useCategory = () => {
  const [category, setCategory] = React.useState<IProductCategoryResponse | IProductSubCategoryResponse | null>(null);
  const [products, setProducts] = React.useState<IProductDetailsCategoryResponse[]>([]);
  const { slug } = useParams()
  const {storeId} = usePickStoreId()

  const handleGetCategory = React.useCallback(async () => {
    try {
      console.log(storeId);
      const response = await apiInstance.get(`/product-category/find/${slug}/${storeId}`);
      const categoryData = response.data.category;
      console.log(categoryData)
      setCategory(categoryData);

      
      if ('productSubCategory' in categoryData) {
        // Category response - flatten all products from subcategories
        const allProducts = categoryData.productSubCategory.flatMap((sub: IProductSubCategoryResponse) => sub.product);
        setProducts(allProducts);
      } else {
        // Subcategory response - use products directly
        setProducts(categoryData.product);
      }
    } catch (error) {
      const errResponse = error as AxiosError<{ message: string }>;
      toast.error(errResponse.response?.data.message);
    }
  }, [slug, storeId]);
  
  React.useEffect(() => {
    if (storeId) {
      
      handleGetCategory();
    }

  }, [storeId]);

  const breadcrumbLinks = React.useMemo(() => {
    if (!category) return [{ label: "Home", href: "/" }];
    
    const isSubCategory = "productCategory" in category;
    
    if (isSubCategory) {
      // Subcategory: Home > Category > Subcategory (#)
      return [
        { label: "Home", href: "/" },
        {
          label: category.productCategory.name,
          href: `/c/${category.productCategory.slug}`,
        },
        {
          label: category.name,
          href: "#",
        },
      ];
    } else {
      // Category: Home > Category (#)
      return [
        { label: "Home", href: "/" },
        {
          label: category.name || "",
          href: "#",
        },
      ];
    }
  }, [category]);

  return { category, breadcrumbLinks, products, storeId };
};