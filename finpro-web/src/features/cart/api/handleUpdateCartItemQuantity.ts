import apiInstance from "@/utils/api/apiInstance";

export const updateCartItemQuantity = async (token: String, cartItemId: String, quantity: Number) => {
  const response = await apiInstance.put(
    `/cart/${cartItemId}/update-qty`,
    { quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};
