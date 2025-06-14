import { useAllProducts } from "@/hooks/products/useAllProducts";
import { useProductDetails } from "@/hooks/products/useProductDetails"
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { ITableColumn } from "../components/AdminListTable";
import { title } from "process";

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
  const columnTitles: ITableColumn[] = productsListTitle.map(({key, title})=>({key, label: title}));
    const getProductCellValue = (product: IProductDetails, key: string) => {
      switch (key) {
        case "image":
          return (
            <CldImage
              src={product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? ""}
              width={60}
              height={60}
              alt={product.name}
            />
          );
        case "name":
          return (
            <Link href={`/p/${product.slug}`} className="text-blue-600 hover:underline hover:font-medium">
              {product.name || "—"}
            </Link>
          );
        case "brand":
          return product.productBrand?.name || "—";
        case "category":
          return product.productSubCategory.productCategory.name || "—";
        case "subCategory":
          return product.productSubCategory.name || "—";
        case "action":
          return (
            <Link href={`/products/edit/${product.slug}`} className="font-medium text-blue-600 hover:underline">
              Edit
            </Link>
          );
        default:
          return (product[key as keyof IProductDetails] as string | number) || "—";
      }
    };

    return {products, productsListTitle, columnTitles, getProductCellValue}
}