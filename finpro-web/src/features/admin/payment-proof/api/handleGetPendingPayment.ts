import apiInstance from "@/utils/api/apiInstance";

export const getPendingPayments = async () => {
  const response = await apiInstance.get(`/payment/pending-users`);
  return response.data;
};
