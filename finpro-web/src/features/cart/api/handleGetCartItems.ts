import { IAuthState } from "@/types/auth/auth.type";
import authStore from "@/zustand/store";
import apiInstance from "@/utils/api/apiInstance";

// load cart items from the database

export const handleGetCartItems = async (token: String) => {
  console.log(token);

  const cartItems = await apiInstance.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return cartItems;
};
