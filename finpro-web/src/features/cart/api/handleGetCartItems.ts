import apiInstance from "@/utils/api/apiInstance";
import authStore from "@/zustand/store";
//nnt check lg
// load cart items from the database

export const handleGetCartItems = async () => {
  const token = authStore((state: any) => state.token);
  // console.log("Token:", token);
  const cartItems = await apiInstance.get("/cart");
  return { cartItems, token };
};
