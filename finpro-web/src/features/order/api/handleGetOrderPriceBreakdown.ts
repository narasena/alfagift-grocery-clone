import apiInstance from "@/utils/api/apiInstance";

export const getPriceBreakdown = async (token: string) => {
  const priceBreakdown = await apiInstance.get(`/order/get-price-breakdown`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return priceBreakdown.data;
};
