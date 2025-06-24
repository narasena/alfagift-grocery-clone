import apiInstance from "@/utils/api/apiInstance";
export const deleteAllCartItems = async (token: String) => {
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
