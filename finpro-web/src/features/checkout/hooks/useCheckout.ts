import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { getPriceBreakdown } from "../../checkout/api/handleGetOrderPriceBreakdown";

export default function useCheckout() {
  const token = useAuthStore((state) => state.token);
  const [priceBreakdown, setPriceBreakdown] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);

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
    loading,
    priceBreakdown,
    selectedMethod,
    setSelectedMethod,
  };
}
