import * as React from "react";
import { toast } from "react-toastify";
import { EPaymentType } from "@/types/payment/payment.type";
import { createPaymentRequest } from "../api/handleCreatePayment";

export default function usePayment() {
  const [loading, setLoading] = React.useState(false);

  const createPayment = async ({
    token,
    orderId,
    paymentType,
    paymentMethod,
    paymentAmount,
    notes,
  }: {
    token: string;
    orderId: string;
    paymentType: EPaymentType;
    paymentMethod: string;
    paymentAmount: number;
    notes?: string;
  }) => {
    setLoading(true);
    try {
      const result = await createPaymentRequest(token, orderId, paymentType, paymentMethod, paymentAmount, notes || "");

      toast.success("Payment created! Status: PENDING");
      return result;
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create payment.");
      throw error; // in case caller wants to handle it too
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
  };
}
