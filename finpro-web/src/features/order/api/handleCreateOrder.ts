import apiInstance from "@/utils/api/apiInstance";

export const createOrder = async (token: string, shippingAddressId: string, storeId: string, voucherId?: string) => {
  const response = await apiInstance.post(
    "/order/create",
    {
      shippingAddressId,
      storeId,
      voucherId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
