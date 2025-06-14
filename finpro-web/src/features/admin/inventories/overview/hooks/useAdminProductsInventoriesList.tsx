import { IProductStock } from "@/types/inventories/product.stock.type";
import { useAllProductsStocks } from "../../hooks/useAllProductsStocks";
import { ITableColumn } from "@/features/admin/products/list/components/AdminListTable";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";

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
        return (
          <AdminProductTableCellDataLink
            hrefLink={`/inventories/product/${stock.product.slug}`}
            hrefLabel={stock.product.name}
          />
        );
      case "sku":
        return stock.product.sku || "—";
      case "store":
        return stock.store.name || "—";
      case "action":
            return (
                <AdminProductTableCellDataLink
                    hrefLink="#"
                    hrefLabel="Edit"
                />
            )
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
