import * as React from "react";
import useAuthStore from "@/zustand/authStore";
// import { toast } from "react-toastify";
import { getPriceBreakdown } from "../../checkout/api/handleGetOrderPriceBreakdown";
import { IOrderDetails } from "@/types/orders/orders.type";

export default function useCheckout() {
  const token = useAuthStore((state) => state.token);
  const [priceBreakdown, setPriceBreakdown] = React.useState<IOrderDetails|null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedType, setSelectedType] = React.useState<"BANK_TRANSFER" | "PAYMENT_GATEWAY" | null>(null);

  const handleGetOrderPriceBreakdown = async () => {
    try {
      if (token) {
        // setLoading(true);
        const breakdown = await getPriceBreakdown(token);
        setPriceBreakdown(breakdown.order);
        console.log("Price Breakdown:", breakdown.order);

        setLoading(false);
      }
    } catch (error) {
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
    selectedType,
    setSelectedType,
  };
}
