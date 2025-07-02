import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { handleGetOrder } from "../api/handleGetOrder";
import { createOrder } from "../api/handleCreateOrder";
import { getOrderByStatus } from "../api/handleGetOrderByStatus";

export default function useOrder(statusForPage?: string) {
  const token = useAuthStore((state) => state.token);
  const [order, setOrder] = React.useState<any>(null);
  const [orderHistory, setOrderHistory] = React.useState<any[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

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
      toast.error("Gagal menampilkan pesanan berdasarkan status.");
    }
  };

  React.useEffect(() => {
    if (statusForPage) {
      handleGetOrderByStatus(statusForPage);
    }
  }, [statusForPage, token]);

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
    orderHistory,
    order,
    isSummaryOpen,
    setIsSummaryOpen,
    handleCreateOrder,
  };
}
