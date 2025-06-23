import apiInstance from "@/utils/api/apiInstance";

//blm dicek
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

// const cartItems = await apiInstance.put("/cart/:cartItemId/delete"
