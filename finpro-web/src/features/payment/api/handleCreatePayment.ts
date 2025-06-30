import { EPaymentType } from "@/types/payment/payment.type";
import apiInstance from "@/utils/api/apiInstance";

export const createPaymentRequest = async (
  token: string,
  orderId: string,
  paymentType: EPaymentType,
  paymentMethod: string,
  paymentAmount: number,
  notes: string
) => {
  const response = await apiInstance.post(
    "/payment/create",
    {
      orderId,
      paymentType,
      paymentMethod,
      paymentAmount,
      notes,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
