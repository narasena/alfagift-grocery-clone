import apiInstance from "@/utils/api/apiInstance";

export const deleteCartItem = async (token: String, cartItemId: String) => {
  const cartItem = await apiInstance.put(
    `/cart/${cartItemId}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return cartItem;
};
