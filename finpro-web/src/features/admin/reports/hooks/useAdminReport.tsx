import { EStockMovementType } from "@/types/inventories/product.stock.type";
import * as React from "react";
import { FaMoneyBills } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllStores } from "@/hooks/stores/useAllStores";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";
import { IProductStockReport, IProductStockReportMonthly, TProductStockReport } from "@/types/products/product.type";

interface ISalesReport {
  id: string;
  month: string;
  year: number;
  totalSales: number;
  totalOrders: number;
  storeName?: string;
  categoryName?: string;
  productName?: string;
  productSales?: number;
}

interface ISalesReportMonthly {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  storeName: string;
  paymentStatus: string;
  productName?: string;
  quantity?: number;
  categoryName?: string;
}

export const useAdminReport = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { stores } = useAllStores();
  const [stocksReport, setStocksReport] = React.useState<IProductStockReport[]>([]);
  const [salesReport, setSalesReport] = React.useState<ISalesReport[]>([]);
  // const [salesLength, setSalesLength] = React.useState(0);
  const [salesPagination, setSalesPagination] = React.useState({ current: 1, total: 0 });
  const [stockLength, setStockLength] = React.useState(0);
  const [stocksReportType, setStocksReportType] = React.useState<string>(searchParams.get("reportType") || "total");
  const stocksPagination = React.useRef(1);

  const [activeTab, setActiveTab] = React.useState<string>(searchParams.get("tab") || "sales");

  const handleStocsReportTypeChange = (type: string) => {
    setStocksReportType(type);
    console.log(type);
    stocksPagination.current = 1;
    updateFilters({ reportType: type, page: "1" });
  };
  const handleGetStocksReport = React.useCallback(async (filterParams = filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await apiInstance.get(`/inventories/report?${params.toString()}`);
      console.log(response.data.stocksReport);
      setStocksReport(response.data.stocksReport);
      setStockLength(response.data.stocksReportLength);
    } catch (error) {
      console.error(`Error fetching stocks report: `, error);
      toast.error(`Failed to fetch stocks report. Please try again later.`);
    }
  }, []);

  const handleGetSalesReport = React.useCallback(async (filterParams = filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await apiInstance.get(`/payment/sales-report?${params.toString()}`);
      setSalesReport(response.data.salesReport);
      // setSalesLength(response.data.salesReportLength);
      setSalesPagination({
        current: Math.ceil(response.data.salesReportLength / Number(filterParams.limit)),
        total: response.data.salesReportLength,
      });
    } catch (error) {
      console.error(`Error fetching sales report: `, error);
      toast.error(`Failed to fetch sales report. Please try again later.`);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "stock") {
      handleGetStocksReport();
    } else if (activeTab === "sales") {
      handleGetSalesReport();
    }
  }, [activeTab]);

  const tabHeaders = [
    {
      label: "Sales Report",
      key: "sales",
      icon: <FaMoneyBills />,
    },
    {
      label: "Stock Report",
      key: "stock",
      icon: <MdInventory />,
    },
  ];

  // Filter states from URL
  const [filters, setFilters] = React.useState({
    month: searchParams.get("month") || "",
    storeId: searchParams.get("storeId") || "",
    type: searchParams.get("type") || "",
    reportType: searchParams.get("reportType") || "total",
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
    sortOrder: searchParams.get("sortOrder") || "desc",
    search: searchParams.get("search") || "",
    paymentStatus: searchParams.get("paymentStatus") || "SUCCESS",
  });

  const [searchTerm, setSearchTerm] = React.useState(filters.search);
  React.useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      updateFilters({ search: searchTerm, page: "1" });
    }, 500);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(stockLength / Number(filters.limit)));
    stocksPagination.current = totalPages;
    // if you want, also clamp the current page so it never exceeds totalPages:
    if (Number(filters.page) > totalPages) {
      updateFilters({ page: String(totalPages) });
    }
  }, [stockLength, filters.limit]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<typeof filters & { paymentStatus?: string }>) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);

    // const params = new URLSearchParams();
    // params.set("tab", activeTab);
    const params = new URLSearchParams({ tab: activeTab, ...merged });
    // Object.entries(updatedFilters).forEach(([key, value]) => {
    //   if (value) params.set(key, value);
    // });

    router.push(`?${params.toString()}`);
    if (activeTab === "stock") {
      handleGetStocksReport(merged);
    } else if (activeTab === "sales") {
      handleGetSalesReport(merged);
    }
  };

  // Update tab and URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const updateSearachFiltersDebounced = React.useCallback(
    (value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(async () => {
        const updatedFilters = { ...filters, search: value };
        setFilters(updatedFilters);

        const params = new URLSearchParams();
        params.set("tab", activeTab);
        Object.entries(updatedFilters).forEach(([key, val]) => {
          if (val) params.set(key, val);
        });
        router.push(`?${params.toString()}`);

        // Call API directly to avoid dependency issues
        try {
          const apiParams = new URLSearchParams();
          Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) apiParams.set(key, value);
          });
          if (activeTab === "stock") {
            const response = await apiInstance.get(`/inventories/report?${apiParams.toString()}`);
            setStocksReport(response.data.stocksReport);
            setStockLength(response.data.stocksReportLength);
          } else if (activeTab === "sales") {
            const response = await apiInstance.get(`/payments/sales-report?${apiParams.toString()}`);
            setSalesReport(response.data.salesReport);
            // setSalesLength(response.data.salesReportLength);
          }
        } catch (error) {
          console.error(`Error fetching stocks report: `, error);
          toast.error(`Failed to fetch stocks report. Please try again later.`);
        }
      }, 500);
    },
    [filters, activeTab, router]
  );
  const stockTableTitles = React.useMemo(() => {
    const baseTitles = [
      { key: "index", label: "No" },
      { key: "product", label: "Product" },
    ];

    if (filters.storeId === "") {
      baseTitles.push({ key: "store", label: "Store" });
    }
    if (filters.reportType === "monthly") {
      baseTitles.push(
        { key: "type", label: "Movement Type" },
        { key: "qty", label: "Quantity" },
        { key: "date", label: "Date" }
      );
    }
    if (filters.reportType === "total") {
      baseTitles.push(
        { key: "current", label: "Current Stock" },
        { key: "add", label: "Total Addition" },
        { key: "subtract", label: "Total Subtraction" },
        { key: "action", label: "Action" }
      );
    }

    return baseTitles;
  }, [filters.storeId]);

  const salesTableTitles = React.useMemo(() => {
    const baseTitles = [
      { key: "index", label: "No" },
      { key: "month", label: "Month" },
    ];

    if (filters.storeId === "") {
      baseTitles.push({ key: "store", label: "Store" });
    }

    if (filters.reportType === "total") {
      baseTitles.push({ key: "totalSales", label: "Total Sales" }, { key: "totalOrders", label: "Total Orders" });
    } else {
      baseTitles.push(
        { key: "orderDate", label: "Order Date" },
        { key: "totalAmount", label: "Amount" },
        { key: "paymentStatus", label: "Status" }
      );
    }

    return baseTitles;
  }, [filters.storeId, filters.reportType]);

  const stockIdIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    stocksReport.forEach((stockRep) => {
      if (!map.has(String(stockRep.productId))) {
        map.set(String(stockRep.productId), map.size + 1);
      }
    });
    return map;
  }, [stocksReport]);

  const renderStockCell = (stock: TProductStockReport, key: string) => {
    switch (key) {
      case "index":
        return stockIdIndexMap.get(String(stock.productId)) || 0;
      case "product":
        if (stocksReportType === "monthly") {
          return (stock as IProductStockReportMonthly).productStock?.product.name || "N/A";
        } else if (stocksReportType === "total") {
          return stock.product?.name || "N/A";
        }
        return "N/A";
      case "type":
        return (stock as IProductStockReportMonthly).type === EStockMovementType.STORE_IN ? (
          <span className="badge badge-primary">Addition</span>
        ) : (stock as IProductStockReportMonthly).type === EStockMovementType.STORE_OUT ? (
          <span className="badge badge-secondary">Subtraction</span>
        ) : (
          "N/A"
        );
      case "store":
        if (stocksReportType === "monthly") {
          return (stock as IProductStockReportMonthly).productStock?.store.name || "N/A";
        } else if (stocksReportType === "total") {
          return stock.store?.name || "N/A";
        }
        return "N/A";
      case "qty":
        return (stock as IProductStockReportMonthly).quantity || 0;
      case "date":
        return (
          new Date((stock as IProductStockReportMonthly).createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }) || "N/A"
        );
      case "current":
        return "stock" in stock ? stock.stock : 0;
      case "add":
        return "storeInQuantity" in stock ? stock.storeInQuantity : 0;
      case "subtract":
        return "storeOutQuantity" in stock ? stock.storeOutQuantity : 0;
      case "action":
        return (
          <div className="flex gap-2">
            <button className="btn btn-primary">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </div>
        );
      default:
        return "N/A";
    }
  };

  const renderSalesCell = (sales: ISalesReport | ISalesReportMonthly, key: string) => {
    switch (key) {
      case "index":
        return salesReport.findIndex((s) => s.id === (sales as ISalesReport).id) + 1;
      case "month":
        if (filters.reportType === "total") {
          return `${(sales as ISalesReport).month} ${(sales as ISalesReport).year}`;
        } else {
          return new Date((sales as ISalesReportMonthly).orderDate).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          });
        }
      case "store":
        return (sales as ISalesReport).storeName || (sales as ISalesReportMonthly).storeName || "N/A";
      case "totalSales":
        return `${
          (sales as ISalesReport).totalSales.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }) || 0
        }`;
      case "totalOrders":
        return (sales as ISalesReport).totalOrders || 0;
      case "orderDate":
        return new Date((sales as ISalesReportMonthly).orderDate).toLocaleDateString("en-GB");
      case "totalAmount":
        return `${(sales as ISalesReportMonthly).totalAmount?.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }) || 0}`;
      case "paymentStatus":
        const status = (sales as ISalesReportMonthly).paymentStatus;
        return (
          <span
            className={`badge  ${
              status === "SUCCESS" ? "badge-success" : status === "PENDING" ? "badge-warning" : "badge-error"
            }`}
          >
            {status}
          </span>
        );
      default:
        return "N/A";
    }
  };
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2022, i, 1);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  });

  return {
    tabHeaders,
    activeTab,
    setActiveTab: handleTabChange,
    filters,
    updateFilters,
    stocksReport,
    stockTableTitles,
    renderStockCell,
    stores,
    stocksPagination,
    stockLength,
    updateSearachFiltersDebounced,
    months,
    stocksReportType,
    handleStocsReportTypeChange,
    handleGetStocksReport,
    searchTerm,
    setSearchTerm,
    salesReport,
    salesTableTitles,
    renderSalesCell,
    salesPagination,
    handleGetSalesReport,
  };
};
