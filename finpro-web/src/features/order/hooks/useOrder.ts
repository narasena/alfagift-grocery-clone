import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";

export default function useOrder() {
  const token = useAuthStore((state) => state.token);
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

  // display order
  const handleGetOrder = async (token: string) => {
    try {
      if (token) {
        setLoading(true);
        const order = await handleGetOrder(token);
        console.log("Order:", order);
        setOrder(order);
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
      handleGetOrder(token);
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
