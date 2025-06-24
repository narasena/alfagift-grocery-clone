import { IProductStockDetail } from "@/types/inventories/product.stock.type";
import { useGetProductStockDetail } from "./useGetProductStockDetail";

export const useAdminProductStockDetail = () => {
  const { productStockDetail } = useGetProductStockDetail();

  const productStockDetailColumnnTitles = [
    { key: "index", label: "No." },
    { key: "date", label: "Date" },
    { key: "type", label: "Movement Type" },
    { key: "quantity", label: "Quantity" },
    { key: "ref", label: "Reference" },
    { key: "note", label: "Note" },
    // {key:'actions', label:'Actions'}
  ];

  const createRenderCell = (stockHistoryArray: IProductStockDetail[]) => {
    return (stockHistory: IProductStockDetail, key: string) => {
      const index = stockHistoryArray.findIndex((item) => item.id === stockHistory.id);
      switch (key) {
        case "index":
          return index + 1;
        case "date":
          return stockHistory.createdAt
            ? new Date(stockHistory.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—";
        case "type":
          return stockHistory.type || "—";
        case "quantity":
          return stockHistory.quantity || "—";
        case "ref":
          return stockHistory.reference || "—";
        case "note":
          return stockHistory.notes || "—";
        default:
          return "—";
      }
    };
  };

  const prepareDataWithIndices = (stockHistoryArray: IProductStockDetail[]) => {
    return stockHistoryArray.map((item, index) => ({ ...item, index: index + 1 }));
  };

  const stockHistory = productStockDetail?.stockHistory || [];
  const stockHistoryWithIndices = prepareDataWithIndices(stockHistory);
  const renderCell = createRenderCell(stockHistory);

  return { productStockDetail, productStockDetailColumnnTitles, renderCell, stockHisoryData: stockHistoryWithIndices };
};
