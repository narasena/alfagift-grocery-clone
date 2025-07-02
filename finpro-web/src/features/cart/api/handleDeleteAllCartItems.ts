import apiInstance from "@/utils/api/apiInstance";
export const deleteAllCartItems = async (token: string) => {
  const response = await apiInstance.put(
    "/cart/delete-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
