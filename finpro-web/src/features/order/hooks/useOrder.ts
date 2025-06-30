import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { handleGetOrder } from "../api/handleGetOrder";

export default function useOrder() {
  const token = useAuthStore((state) => state.token);
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

  // display order
  const handleDisplayOrder = async (token: string) => {
    try {
      console.log(">>>>");

      if (token) {
        setLoading(true);
        const orderItems = await handleGetOrder(token);
        console.log("Order:", orderItems.data.ordersWithDetails);
        setOrder(orderItems.data.ordersWithDetails);
        toast.success("Berhasil menampilkan pesanan");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error displaying order:", error);
    } finally {
      setLoading(false);
    }
  };

  // create order

  // Call getOrder when page loads
  React.useEffect(() => {
    if (token) {
      handleDisplayOrder(token);
    }
  }, [token]);

  return {
    token,
    order,
    loading,
    isSummaryOpen,
    setIsSummaryOpen,
  };
}
