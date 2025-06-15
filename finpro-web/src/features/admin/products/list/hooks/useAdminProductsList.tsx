import { useAllProducts } from "@/hooks/products/useAllProducts";
import { IProductDetails } from "@/types/products/product.type";
import { ITableColumn } from "../../../components/AdminTable";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";

export const useAdminProductList = () => {
  const { products } = useAllProducts();
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
        return <AdminProductTableCellDataImage {...product} />;
      case "name":
        return <AdminProductTableCellDataLink hrefLink={`/p/${product.slug}`} hrefLabel={product.name} />;
      case "brand":
        return product.productBrand?.name || "—";
      case "category":
        return product.productSubCategory.productCategory.name || "—";
      case "subCategory":
        return product.productSubCategory.name || "—";
      case "action":
        return <AdminProductTableCellDataLink hrefLink={`/products/edit/${product.slug}`} hrefLabel="Edit" />;
      default:
        return (product[key as keyof IProductDetails] as string | number) || "—";
    }
  };

  return { products, productsListTitle, productsListColumnTitles, getProductCellValue };
};
