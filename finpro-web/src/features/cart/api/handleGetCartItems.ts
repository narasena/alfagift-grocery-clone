import { IAuthState } from "@/types/auth/auth.type";
import apiInstance from "@/utils/api/apiInstance";
import authStore from "@/zustand/store";
//nnt check lg
// load cart items from the database

export const handleGetCartItems = async () => {
  const token = authStore((state: IAuthState) => state.token);
  // console.log("Token:", token);
  const cartItems = await apiInstance.get("/cart");
  return { cartItems, token };
};
