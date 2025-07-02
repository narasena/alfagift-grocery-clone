import apiInstance from "@/utils/api/apiInstance";

export const verifyPaymentProof = async (paymentId: string, action: string) => {
  const response = apiInstance.post(`/payment/${paymentId}/verify`, {
    action,
  });
  return response;
};
