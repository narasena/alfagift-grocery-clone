import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { createOrder } from "../api/handleCreateOrder";
import { getOrderByStatus } from "../api/handleGetOrderByStatus";
import { useSearchParams } from "next/navigation";
import { handleGetOrder } from "../api/handleGetOrder";

export default function useOrder(statusForPage?: string) {
  const token = useAuthStore((state) => state.token);
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "WAITING_FOR_PAYMENT";
  const [order, setOrder] = React.useState<any>(null);
  const [orderHistory, setOrderHistory] = React.useState<any[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ordersPerPage = 5;

  // const [filters, setFilters] = React.useState({
  //   page: searchParams.get("page") || "1",
  //   limit: searchParams.get("limit") || "5",
  //   sortOrder: searchParams.get("sortOrder") || "desc",
  // });

  // create order
  const handleCreateOrder = async (shippingAddressId: string, storeId: string) => {
    try {
      if (token) {
        // setLoading(true);
        const response = await createOrder(token, shippingAddressId, storeId);
        setOrder(response.data);
        toast.success(`Barang berhasil dipesan!`);
        return response.data.id;
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      // setLoading(false);
    }
  };

  // display Order By Status
  const handleGetOrderByStatus = async (status: string) => {
    try {
      if (token) {
        const response = await getOrderByStatus(token, status);
        setOrderHistory(response.ordersWithDetails);
        console.log("Orders by status: ", response.ordersWithDetails);
      }
    } catch (error) {
      console.error("Failed to fetch orders by status:", error);
    }
  };

  React.useEffect(() => {
    if (statusForPage) {
      handleGetOrderByStatus(statusForPage);
    }
  }, [statusForPage, token]);

  const paginatedOrders = orderHistory.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(orderHistory.length / ordersPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // display order
  // const handleDisplayOrder = async (token: string) => {
  //   try {
  //     if (token) {
  //       // setLoading(true);
  //       const orderItems = await handleGetOrder(token);
  //       console.log("Order:", orderItems.data.ordersWithDetails);
  //       setOrder(orderItems.data.ordersWithDetails);
  //       toast.success("Berhasil menampilkan pesanan");
  //       // setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error displaying order:", error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  return {
    status,
    totalPages,
    currentPage,
    paginatedOrders,
    handleNext,
    handlePrevious,
    orderHistory,
    order,
    isSummaryOpen,
    setIsSummaryOpen,
    handleCreateOrder,
  };
}
