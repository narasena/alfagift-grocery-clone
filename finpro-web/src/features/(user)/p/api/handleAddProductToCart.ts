import apiInstance from "@/utils/api/apiInstance";

export const addProductToCart = async (productId: string, quantity: number, storeId: string, token: String) => {
  const response = await apiInstance.post(
    `/cart/${storeId}/add`,
    {
      productId,
      quantity,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  // return response.data;
  return response;
};
