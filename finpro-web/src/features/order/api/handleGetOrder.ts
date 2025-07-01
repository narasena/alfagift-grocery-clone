import apiInstance from "@/utils/api/apiInstance";

export const handleGetOrder = async (token: string) => {
  const orderItems = await apiInstance.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return orderItems;
};
