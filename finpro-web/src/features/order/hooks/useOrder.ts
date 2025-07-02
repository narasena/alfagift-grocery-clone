import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { handleGetOrder } from "../api/handleGetOrder";
import { createOrder } from "../api/handleCreateOrder";

export default function useOrder() {
  const token = useAuthStore((state) => state.token);
  const [order, setOrder] = React.useState<any>(null);

  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

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

  return {
    order,
    isSummaryOpen,
    setIsSummaryOpen,
    handleCreateOrder,
  };
}
