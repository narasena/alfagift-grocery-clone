import * as React from "react";
import { EPaymentType } from "@/types/payment/payment.type";
import { createPaymentRequest } from "../api/handleCreatePayment";
import useAuthStore from "@/zustand/authStore";
import { useParams } from "next/navigation";
import { getOrderById } from "@/features/order/api/handleGetOrderById";

export default function usePayment() {
  const [loading, setLoading] = React.useState(false);
  const token = useAuthStore((state) => state.token);
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = React.useState<{ id: string; finalTotalAmount: number } | null>(null);

  const handleGetOrderById = async (token: string) => {
    if (token) {
      try {
        const response = await getOrderById(token, orderId as string);
        // return response.orderById;
        console.log(response);

        setOrderDetail(response.orderById);
      } catch (error) {
        console.log("Failed to get order details", error);
      }
    }
  };

  const handlePayment = async (paymentType: EPaymentType, paymentMethod: string) => {
    if (token) {
      try {
        setLoading(true);
        const response = await createPaymentRequest(
          token,
          orderDetail?.id ?? "",
          paymentType,
          paymentMethod,
          orderDetail?.finalTotalAmount ?? 0
        );
        // toast.success("Pembayaran");
        setLoading(false);
        return response.payment.id; // return payment ID for further processing
      } catch (error) {
        console.error("Failed to process payment", error);
      }
    }
  };

  React.useEffect(() => {
    if (token) {
      handleGetOrderById(token);
    }
  }, [token, orderId]);

  return {
    handlePayment,
    handleGetOrderById,
    loading,
  };
}
