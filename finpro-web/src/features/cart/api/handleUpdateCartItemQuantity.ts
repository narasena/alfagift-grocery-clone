import apiInstance from "@/utils/api/apiInstance";

export const updateCartItemQuantity = async (
  token: string,
  cartItemId: string,
  quantity: number,
  productId: string,
  storeId: string
) => {
  const response = await apiInstance.put(
    `/cart/item/${cartItemId}/product/${productId}/store/${storeId}/update-qty`,
    { quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

// `/cart/${cartItemId}/update-qty`,
