import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { handleGetOrder } from "../api/handleGetOrder";
import { createOrder } from "../api/handleCreateOrder";
import { getPriceBreakdown } from "../api/handleGetOrderPriceBreakdown";

export default function useOrder() {
  const token = useAuthStore((state) => state.token);
  const [order, setOrder] = React.useState<any>(null);
  const [priceBreakdown, setPriceBreakdown] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);

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
        toast.success(`Berhasil membuat pesanan!`);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handleGetOrderPriceBreakdown = async () => {
    try {
      if (token) {
        // setLoading(true);
        const breakdown = await getPriceBreakdown(token);
        setPriceBreakdown(breakdown.order);
        console.log("Price Breakdown:", breakdown.order);

        toast.success("Berhasil mendapatkan rincian harga pesanan");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to get order price breakdown");
      console.log("Error getting order price breakdown:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (token) {
      handleGetOrderPriceBreakdown();
    }
  }, [token]);

  return {
    order,
    loading,
    priceBreakdown,
    isSummaryOpen,
    setIsSummaryOpen,
    selectedMethod,
    setSelectedMethod,
    handleCreateOrder,
  };
}
