import apiInstance from "@/utils/api/apiInstance";

export const getOrderDetails = async (token: string, orderId: string) => {
  const response = await apiInstance.get(`/order/details/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
