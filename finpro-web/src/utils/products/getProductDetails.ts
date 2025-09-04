import apiInstance from "@/utils/api/apiInstance";


export const getProductDetails = async (slug: string, storeId: string) => {
  try {
    console.log(slug, storeId);
    const response = await apiInstance.get(`/product/details/${slug}/${storeId}`);
    return response.data.product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
