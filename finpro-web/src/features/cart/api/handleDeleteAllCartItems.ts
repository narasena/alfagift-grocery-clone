import apiInstance from "@/utils/api/apiInstance";
//belum di-tes
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
  // return response.data;
  return response;
};
