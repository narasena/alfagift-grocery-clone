import apiInstance from "@/utils/api/apiInstance";

export const getOrderByStatus = async (token: string, status: string) => {
  const response = await apiInstance.get(`/order/by-status?status=${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
