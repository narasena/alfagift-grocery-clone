import { ICartItem } from "@/types/carts/cart.type";
import * as React from "react";
import { handleGetCartItems } from "../api/handleGetCartItems";

export default function useCartItems() {
  const [cartItems, setCartItems] = React.useState<ICartItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleDisplayCartItems = async () => {
    try {
      const cartItems = await handleGetCartItems();
      setCartItems(cartItems.data);
      setLoading(false);
    } catch (error) {
      console.log("Error displaying cart items:", error);
    }
  };
  React.useEffect(() => {
    handleDisplayCartItems();
  }, []);
  return {
    cartItems,
    loading,
    handleDisplayCartItems,
  };
}
