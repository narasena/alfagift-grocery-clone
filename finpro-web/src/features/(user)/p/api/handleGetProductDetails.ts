import apiInstance from "@/utils/api/apiInstance";

export const getProductDetails = async (slug: string) => {
  const response = await apiInstance.get("/product/" + slug);
  return response;
};
