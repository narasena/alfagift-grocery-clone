import { IProductStock, IProductStockTable } from "@/types/inventories/product.stock.type";
import { useAllProductsStocks } from "../../hooks/useAllProductsStocks";
import { ITableColumn } from "@/features/admin/products/list/components/AdminListTable";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataName from "@/features/admin/components/AdminProductTableCellDataName";
import AdminProductTableCellDataEdit from "@/features/admin/components/AdminProductTableCellDataEdit";

export const useAdminProductInventoriesList = () => {
  const { stocks } = useAllProductsStocks();
  const stocksListTitle = [
    { key: "image", title: "Image" },
    { key: "name", title: "Product Name" },
    { key: "store", title: "Store" },
    { key: "sku", title: "SKU" },
    { key: "stock", title: "Stock" },
    { key: "price", title: "Price" },
    { key: "actions", title: "Actions" },
  ];
  const stocksListColumnTitles: ITableColumn[] = stocksListTitle.map(({ key, title }) => ({ key, label: title }));
  const getStockCellValue = (stock: IProductStock, key: string) => {
    switch (key) {
      case "image":
        return <AdminProductTableCellDataImage {...stock.product} />;
      case "name":
        return <AdminProductTableCellDataName {...stock.product} />;
      case "sku":
        return stock.product.sku || "—";
      case "store":
        return stock.store.name || "—";
      case "action":
        return <AdminProductTableCellDataEdit {...stock.product} />;
      default:
        return (stock.product[key as keyof typeof stock.product] as string | number) || "—";
    }
  };

  return {
    stocks,
    stocksListTitle,
    stocksListColumnTitles,
    getStockCellValue,
  };
};
