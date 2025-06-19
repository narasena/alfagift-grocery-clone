import apiInstance from "@/utils/api/apiInstance";
//belum selesai
//belum di-tes
//pake trycatch?
export const addProductToCart = async (productId: string, quantity: number, storeId: string) => {
  const response = await apiInstance.post("/cart/add", {
    productId,
    quantity,
    storeId,
  });
  // return response.data;
  return response;
};
