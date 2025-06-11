import apiInstance from "@/utils/api/apiInstance";

//nnt check lg
// load cart items from the database
export const handleGetCartItems = async () => {
  const response = await apiInstance.get("/cart");
  return response;
};
