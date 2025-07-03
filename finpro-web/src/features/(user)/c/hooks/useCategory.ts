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
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const { slug } = useParams()
  const {storeId} = usePickStoreId()
  const limit = 10;

  const handleGetCategory = React.useCallback(async (page = 1) => {
    try {
      console.log(storeId);
      const response = await apiInstance.get(`/product-category/find/${slug}/${storeId}?page=${page}&limit=${limit}`);
      const categoryData = response.data.category;
      const { products: paginatedProducts, totalProducts: total, totalPages: pages } = response.data;
      
      console.log(categoryData)
      setCategory(categoryData);
      setProducts(paginatedProducts);
      setTotalProducts(total);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (error) {
      const errResponse = error as AxiosError<{ message: string }>;
      toast.error(errResponse.response?.data.message);
    }
  }, [slug, storeId, limit]);
  
  React.useEffect(() => {
    if (storeId) {
      handleGetCategory(1);
    }
  }, [storeId, handleGetCategory]);

  const handlePageChange = (page: number) => {
    handleGetCategory(page);
  };

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

  return { 
    category, 
    breadcrumbLinks, 
    products, 
    storeId, 
    totalProducts, 
    currentPage, 
    totalPages, 
    handlePageChange 
  };
};