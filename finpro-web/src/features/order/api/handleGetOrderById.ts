import apiInstance from "@/utils/api/apiInstance";

export const getOrderById = async (token: string, orderId: string) => {
  const response = await apiInstance.get(`/order/get/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
