import { IProductStock } from "@/types/inventories/product.stock.type";
import apiInstance from "@/utils/api/apiInstance";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

export const useGetProductStocksPerProduct = () => {
  const params = useParams();
  const [productStocks, setProductStocks] = React.useState<IProductStock[]>([]);
  const handleGetProductStocks = async () => {
    try {
      const productStocksResponse = await apiInstance.get(`inventories/product/${params.slug}`);
      setProductStocks(productStocksResponse.data.productStocks);
      toast.success(productStocksResponse.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get product stocks");
    }
  };

    React.useEffect(() => {
    handleGetProductStocks();
  }, []);
    return {
      productStocks
  };
};
