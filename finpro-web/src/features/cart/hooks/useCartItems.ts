import { ICartItem } from "@/types/carts/cartItem.type";
import * as React from "react";
import authStore from "@/zustand/store";
import { IAuthState } from "@/types/auth/auth.type";
import { handleGetCartItems } from "../api/handleGetCartItems";
import { deleteCartItem } from "../api/handleDeleteCartItems";
import { deleteAllCartItems } from "../api/handleDeleteAllCartItems";
import { toast } from "react-toastify";

export default function useCartItems() {
  const token = authStore((state: IAuthState) => state.token);

  const [cartItems, setCartItems] = React.useState<ICartItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleDisplayCartItems = async () => {
    try {
      // console.log(token);

      if (token) {
        const cartItems = await handleGetCartItems(token);
        console.log("Cart items:", cartItems.data.cart.cartItems);
        setCartItems(cartItems.data.cart.cartItems);
        setLoading(false);
        toast.success("Berhasil menampilkan barang di keranjang");
      }
    } catch (error) {
      console.error("Error displaying cart items:", error);
    }
  };

  const handleDeleteCartItem = async (cartItemId: string) => {
    try {
      if (token) {
        await deleteCartItem(token, cartItemId);
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
        toast.success("Berhasil menghapus barang dari keranjang");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleDeleteAllCartItems = async () => {
    try {
      if (token) {
        await deleteAllCartItems(token);
        setCartItems([]); // Clear the cart items in local state
        toast.success("Berhasil menghapus semua barang di keranjang");
      }
    } catch (error) {
      console.log("Error deleting all items:", error);
    }
  };

  React.useEffect(() => {
    if (token) {
      handleDisplayCartItems();
    }
  }, [token]);

  return {
    cartItems,
    loading,
    token,
    handleDisplayCartItems,
    handleDeleteCartItem,
    handleDeleteAllCartItems,
  };
}
