import * as React from "react";
import { IProductStock } from "@/types/inventories/product.stock.type";
import { ITableColumn } from "@/features/admin/components/AdminTable";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";

export const useAdminProductInventoriesList = () => {
  const [stocks, setStocks] = React.useState<IProductStock[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const itemsPerPage = 10;

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

  const fetchStocks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await apiInstance.get(`/inventories/all?${params}`);
      setStocks(response.data.stocks);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching stocks:", error);
      toast.error("Error fetching stocks");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStocks();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchStocks]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStockCellValue = (stock: IProductStock, key: string) => {
    switch (key) {
      case "image":
        return (
          <AdminProductTableCellDataImage
            imageLink={stock.product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
            imageAlt={stock.product.name}
          />
        );
      case "name":
        return (
          <AdminProductTableCellDataLink
            hrefLink={`/inventories/product/${stock.product.slug}`}
            hrefLabel={stock.product.name}
          />
        );
      case "sku":
        return stock.product.sku || "—";
      case "stock":
        return (
          <span className={`px-2 py-1 rounded text-sm ${
            (stock.stock || 0) <= 10 
              ? 'bg-red-100 text-red-800' 
              : (stock.stock || 0) <= 50 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {stock.stock || 0}
          </span>
        );
      case "store":
        return (
          <AdminProductTableCellDataLink
            hrefLink={`/inventories/store/${stock.store.id}`}
            hrefLabel={stock.store.name}
          />
        );
      case "price":
        return `Rp ${(stock.product.price || 0).toLocaleString()}`;
      case "actions":
        return (
          <AdminProductTableCellDataLink 
            hrefLink={`/inventories/product/${stock.product.slug}/${stock.storeId}`} 
            hrefLabel="View Details" 
          />
        );
      default:
        return (stock.product[key as keyof typeof stock.product] as string | number) || "—";
    }
  };

  return {
    stocks,
    stocksListTitle,
    stocksListColumnTitles,
    getStockCellValue,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading
  };
};
