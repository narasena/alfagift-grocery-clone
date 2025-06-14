import { IProductStock } from "@/types/inventories/product.stock.type";
import { useGetProductStocksPerStore } from "./useGetProductStocksPerStore";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";

export const useAdminProductStocksPerStore = () => {
  const { storeStocks, storeName } = useGetProductStocksPerStore();
  const storeStocksListColumnTitles = [
    { key: "image", label: "Image" },
    { key: "name", label: "Product Name" },
    //   { key: "store", label: "Store" },
    { key: "sku", label: "SKU" },
    { key: "stock", label: "Stock" },
    { key: "price", label: "Price" },
    { key: "actions", label: "Actions" },
  ];

  const getStoreStocksCellValue = (storeStock: IProductStock, key: string) => {
    switch (key) {
      case "image":
        return (
          <AdminProductTableCellDataImage
            imageLink={storeStock.product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
            imageAlt={storeStock.product.name}
          />
        );
      case "name":
        return (
          <AdminProductTableCellDataLink
            hrefLink={storeStock && `/inventories/product/${storeStock.product.slug}/${storeStock.storeId}`}
            hrefLabel={storeStock.product.name}
          />
        );
      case "actions":
        return <AdminProductTableCellDataLink hrefLink="#" hrefLabel="Edit" />;
      case "sku":
        return storeStock.product.sku || "—";
      case "price":
        return storeStock.product.price || "—";
      default:
        return (storeStock[key as keyof typeof storeStock] as string | number) || "—";
    }
  };
    return {
        storeStocks,
        storeName,
        storeStocksListColumnTitles,
        getStoreStocksCellValue
  };
};
