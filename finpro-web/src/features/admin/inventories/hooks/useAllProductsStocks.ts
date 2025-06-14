import * as React from "react";
import { IProductStock } from "@/types/inventories/product.stock.type";
import next from "next";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";

export const useAllProductsStocks = () => {
  const [stocks, setStocks] = React.useState<IProductStock[]>([]);
  const handleGetAllProductsStocks = async () => {
    try {
      const stocksResponse = await apiInstance.get("/inventories/all");
      setStocks(stocksResponse.data.stocks);
      toast.success("Stocks fetched successfully");
    } catch (error) {
      console.error(`Error fetching all products stocks`, error);
      toast.error("Error fetching all products stocks");
    }
  };
  React.useEffect(() => {
    handleGetAllProductsStocks();
  }, []);
  return {
    stocks,
    setStocks,
  };
};
