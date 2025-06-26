import { ICartItem } from "@/types/carts/cartItem.type";
import * as React from "react";
import authStore from "@/zustand/store";
import { IAuthState } from "@/types/auth/auth.type";
import { handleGetCartItems } from "../api/handleGetCartItems";
import { deleteCartItem } from "../api/handleDeleteCartItems";
import { deleteAllCartItems } from "../api/handleDeleteAllCartItems";
import { updateCartItemQuantity } from "../api/handleUpdateCartItemQuantity";
import { toast } from "react-toastify";

export default function useCartItems() {
  const token = authStore((state: IAuthState) => state.token);

  const [cartItems, setCartItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  // const handleInitialize = React.useRef(false);

  const handleDisplayCartItems = async () => {
    try {
      // console.log(token);

      if (token) {
        setLoading(true);
        const cartItems = await handleGetCartItems(token);
        console.log("Cart items:", cartItems.data.cartItems);
        setCartItems(cartItems.data.cartItems);
        toast.success("Berhasil menampilkan barang di keranjang");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error displaying cart items:", error);
    } finally {
      setLoading(false);
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

  const openClearAllModal = () => {
    const modal = document.getElementById("clear_all") as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeClearAllModal = () => {
    const modal = document.getElementById("clear_all") as HTMLDialogElement | null;
    modal?.close();
  };

  const openClearItemModal = (cartItemId: string) => {
    setItemToDelete(cartItemId);
    const modal = document.getElementById("clear_item") as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeClearItemModal = () => {
    const modal = document.getElementById("clear_item") as HTMLDialogElement | null;
    modal?.close();
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    // Implement your API call to update quantity in the backend
    if (token) {
      try {
        // Validate quantity
        if (newQuantity < 1) return;

        // Call API to update quantity
        await updateCartItemQuantity(token, cartItemId, newQuantity);

        // Update local state
        setCartItems((prev) =>
          prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
        );
      } catch (error) {
        console.error("Failed to update quantity:", error);
        // You might want to show an error toast here
      }
    }
  };

  const incrementQuantity = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      await updateQuantity(itemId, item.quantity + 1);
    }
  };

  const decrementQuantity = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      await updateQuantity(itemId, item.quantity - 1);
    }
  };

  React.useEffect(() => {
    if (token) {
      handleDisplayCartItems();
    }
    // handleInitialize.current = true;
  }, [token]);

  return {
    cartItems,
    loading,
    token,
    isSummaryOpen,
    setIsSummaryOpen,
    isDeleting,
    setIsDeleting,
    itemToDelete,
    handleDisplayCartItems,
    handleDeleteCartItem,
    handleDeleteAllCartItems,
    openClearAllModal,
    closeClearAllModal,
    openClearItemModal,
    closeClearItemModal,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
  };
}
