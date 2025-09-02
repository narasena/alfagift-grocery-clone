import { EPaymentType } from "@/types/payment/payment.type";
import apiInstance from "@/utils/api/apiInstance";

export const createPaymentRequest = async (
  token: string,
  orderId: string,
  paymentType: EPaymentType,
  paymentMethod: string,
  paymentAmount: number
) => {
  const response = await apiInstance.post(
    `/payment/${orderId}/create`,
    {
      paymentType,
      paymentMethod,
      paymentAmount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
