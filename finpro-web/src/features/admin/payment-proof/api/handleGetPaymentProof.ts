import apiInstance from "@/utils/api/apiInstance";

export const getPaymentProof = async (paymentId: string) => {
  const response = await apiInstance.get(`/payment/${paymentId}/proof-url`);
  return response.data;
};
