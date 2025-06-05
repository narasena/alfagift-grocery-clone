import { IProductDetails } from "@/types/products/product.type";
import apiInstance from "../../utils/api/apiInstance";

export const getProductDetails = async (params: string) => {
  try {
    const response = await apiInstance.get("/product/" + params);
    return response.data.product as IProductDetails;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
