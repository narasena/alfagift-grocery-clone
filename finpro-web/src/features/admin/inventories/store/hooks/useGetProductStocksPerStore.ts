import { IProductStock } from "@/types/inventories/product.stock.type";
import apiInstance from "@/utils/api/apiInstance";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

export const useGetProductStocksPerStore = () => {
  const { storeId } = useParams();
  const [storeStocks, setStoreStocks] = React.useState<IProductStock[]>([]);
  const [storeName, setStoreName] = React.useState<string>("");
  const handleGetProductStocksPerStore = async () => {
    try {
      const storeStocksResponse = await apiInstance.get("inventories/store/" + storeId);
      setStoreStocks(storeStocksResponse.data.storeStocks);
      setStoreName(storeStocksResponse.data.storeName);
      toast.success(storeStocksResponse.data.message);
    } catch (error) {
      console.error("Error fetching product stocks per store:", error);
      toast.error("Error fetching product stocks per store");
    }
  };
  React.useEffect(() => {
    handleGetProductStocksPerStore();
  }, []);
  return { storeId,storeStocks,storeName, handleGetProductStocksPerStore };
};
