import * as React from "react";
import { toast } from "react-toastify";
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

  const handleGetOrderDetail = async (token: string) => {
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
          orderDetail?.id!,
          paymentType,
          paymentMethod,
          orderDetail?.finalTotalAmount!
        );
        toast.success("Your payment is being processed");
        setLoading(false);
        return response;
      } catch (error) {
        console.log("Failed to process payment");
      }
    }
  };

  React.useEffect(() => {
    if (token) {
      handleGetOrderDetail(token);
    }
  }, [token, orderId]);

  // const createPayment = async ({
  //   token,
  //   orderId,
  //   paymentType,
  //   paymentMethod,
  //   paymentAmount,
  //   notes,
  // }: {
  //   token: string;
  //   orderId: string;
  //   paymentType: EPaymentType;
  //   paymentMethod: string;
  //   paymentAmount: number;
  //   notes?: string;
  // }) => {
  //   setLoading(true);

  //   try {
  //     const result = await createPaymentRequest(token, orderId, paymentType, paymentMethod, paymentAmount, notes || "");

  //     toast.success("Payment created! Status: PENDING");
  //     return result;
  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(error?.response?.data?.message || "Failed to create payment.");
  //     throw error; // in case caller wants to handle it too
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handlePayment = async ({
  //   orderId,
  //   paymentType,
  //   paymentMethod,
  //   paymentAmount,
  //   notes,
  // }: {
  //   orderId: string;
  //   paymentType: EPaymentType;
  //   paymentMethod: string;
  //   paymentAmount: number;
  //   notes?: string;
  // }) => {
  //   if (token) {
  //     setLoading(true);

  //     try {
  //       const result = await createPaymentRequest(
  //         token,
  //         orderId,
  //         paymentType,
  //         paymentMethod,
  //         paymentAmount,
  //         notes || ""
  //       );
  //       toast.success("Payment created! Status: PENDING");
  //       setLoading(false);
  //       return result;
  //     } catch (error: any) {
  //       toast.error(error?.response?.data?.message || "Failed to create payment.");
  //       throw error;
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  return {
    // createPayment,
    handlePayment,
    handleGetOrderDetail,
    loading,
  };
}
