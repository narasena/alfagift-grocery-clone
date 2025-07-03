import { IProductDetails } from "@/types/products/product.type";
import { ITableColumn } from "../../../components/AdminTable";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";
import * as React from "react";
import { useProductCategories } from "@/features/(user)/p/hooks/useProductCategories";

export const useAdminProductList = () => {
  const [products, setProducts] = React.useState<IProductDetails[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    search: "",
    categoryId: "",
    subCategoryId: "",
    page: "1",
    limit: "10",
  });
  const { productCategories, productSubCategories } = useProductCategories();

  const handleGetProducts = React.useCallback(async (filterParams = filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await apiInstance.get(`/product/admin/list?${params.toString()}`);
      setProducts(response.data.products);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error(`Error fetching products: `, error);
      toast.error(`Failed to fetch products. Please try again later.`);
    }
  }, []);

  React.useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    handleGetProducts(merged);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page: String(page) });
  };
  const productsListTitle = [
    { key: "image", title: "Image" },
    { key: "name", title: "Product Name" },
    { key: "brand", title: "Brand" },
    { key: "category", title: "Category" },
    { key: "subCategory", title: "Sub Category" },
    { key: "price", title: "Price" },
    { key: "description", title: "Description" },
    { key: "sku", title: "SKU" },
    { key: "barcode", title: "Barcode" },
    { key: "weight", title: "Weight" },
    { key: "dimensions", title: "Dimensions" },
    { key: "action", title: "Actions" },
  ];
  const productsListColumnTitles: ITableColumn[] = productsListTitle.map(({ key, title }) => ({ key, label: title }));
  const getProductCellValue = (product: IProductDetails, key: string) => {
    switch (key) {
      case "image":
        return (
          <AdminProductTableCellDataImage
            imageLink={product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
            imageAlt={product.name}
          />
        );
      case "name":
        return <AdminProductTableCellDataLink hrefLink={`/p/${product.slug}`} hrefLabel={product.name} />;
      case "brand":
        return product.productBrand?.name || "—";
      case "category":
        return product.productSubCategory.productCategory.name || "—";
      case "price":
        return product.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) || "—";
      case "subCategory":
        return product.productSubCategory.name || "—";
      case "action":
        return <AdminProductTableCellDataLink hrefLink={`/products/edit/${product.slug}`} hrefLabel="Edit" />;
      default:
        return (product[key as keyof IProductDetails] as string | number) || "—";
    }
  };

  return { 
    products, 
    productsListTitle, 
    productsListColumnTitles, 
    getProductCellValue,
    totalCount,
    totalPages,
    currentPage,
    filters,
    updateFilters,
    handlePageChange,
    productCategories,
    productSubCategories
  };
};
