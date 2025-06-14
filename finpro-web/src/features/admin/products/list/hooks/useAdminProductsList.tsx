import { useAllProducts } from "@/hooks/products/useAllProducts";
import { useProductDetails } from "@/hooks/products/useProductDetails"
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { ITableColumn } from "../components/AdminListTable";
import { title } from "process";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataName from "@/features/admin/components/AdminProductTableCellDataName";
import AdminProductTableCellDataEdit from "@/features/admin/components/AdminProductTableCellDataEdit";

export const useAdminProductList = () => {
    const { products } = useAllProducts()
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
  const productsListColumnTitles: ITableColumn[] = productsListTitle.map(({key, title})=>({key, label: title}));
    const getProductCellValue = (product: IProductDetails, key: string) => {
      switch (key) {
        case "image":
          return (
            <AdminProductTableCellDataImage {...product} />
          );
        case "name":
          return (
            <AdminProductTableCellDataName {...product} />
          );
        case "brand":
          return product.productBrand?.name || "—";
        case "category":
          return product.productSubCategory.productCategory.name || "—";
        case "subCategory":
          return product.productSubCategory.name || "—";
        case "action":
          return (
            <AdminProductTableCellDataEdit {...product} />
          );
        default:
          return (product[key as keyof IProductDetails] as string | number) || "—";
      }
    };

    return {products, productsListTitle, productsListColumnTitles, getProductCellValue}
}