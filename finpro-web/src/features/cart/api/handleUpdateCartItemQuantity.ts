import apiInstance from "@/utils/api/apiInstance";

export const updateCartItemQuantity = async (
  token: String,
  cartItemId: String,
  quantity: Number,
  productId: String,
  storeId: String
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
