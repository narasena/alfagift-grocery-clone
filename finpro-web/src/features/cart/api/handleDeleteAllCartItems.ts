import apiInstance from "@/utils/api/apiInstance";
//belum selesai
//belum di-tes
//pake trycatch?
export const deleteAllCartItems = async (productId: string, quantity: number, storeId: string) => {
  const response = await apiInstance.put("/cart/delete-all", {
    productId,
    storeId,
  });
  // return response.data;
  return response;
};
