import apiInstance from "@/utils/api/apiInstance";

export const handleGetOrder = async (token: string) => {
  const order = await apiInstance.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
