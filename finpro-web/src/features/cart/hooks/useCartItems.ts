import { ICartItem } from "@/types/carts/cartItem.type";
import * as React from "react";
import { handleGetCartItems } from "../api/handleGetCartItems";
import authStore from "@/zustand/store";
import apiInstance from "@/utils/api/apiInstance";

export default function useCartItems() {
  const token = authStore((state: any) => state.token);

  const [cartItems, setCartItems] = React.useState<ICartItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  // const [token, setToken] = React.useState<string | null>(null);
  // const getToken = () => setToken(authStore((state: any) => state.token));

  const handleGetCartItems = async () => {
    try {
      console.log("Fetching cart items with token:", token);
      if (!token) {
        console.error("No token found, cannot fetch cart items.");
        return;
      }
      const cartItems = await apiInstance.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart items fetched:", cartItems);
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const handleDisplayCartItems = async () => {
    try {
      const cartItems = await handleGetCartItems();
      console.log("Cart items:", cartItems?.data.cart.cartItems);
      setCartItems(cartItems?.data?.cart.cartItems);
      setLoading(false);
    } catch (error) {
      console.error("Error displaying cart items:", error);
    }
  };

  React.useEffect(() => {
    // getToken();
    if (token) {
      handleDisplayCartItems();
    }
  }, [token]);

  return {
    cartItems,
    loading,
    token,
    handleDisplayCartItems,
  };
}
