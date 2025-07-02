import apiInstance from "@/utils/api/apiInstance";

export const deleteCartItem = async (token: string, cartItemId: string) => {
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
