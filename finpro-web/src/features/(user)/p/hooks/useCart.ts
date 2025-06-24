import * as React from "react";
import { ICartItem } from "@/types/carts/cartItem.type";
import { IProduct, IProductDetails } from "@/types/products/product.type";
import { toast } from "react-toastify";
import authStore from "@/zustand/store";
import { IAuthState } from "@/types/auth/auth.type";
import { addProductToCart } from "../api/handleAddProductToCart";
import { handleGetCartItems } from "@/features/cart/api/handleGetCartItems";

export default function useCart() {
  const [cart, setCart] = React.useState<ICartItem[]>([]);
  // const { handleDisplayCartItems } = useCartItems();
  const token = authStore((state: IAuthState) => state.token);

  const handleAddToCart = async (quantity: number = 1, productId: string, storeId: string, product: IProduct) => {
    try {
      if (token) {
        await addProductToCart(productId, quantity, storeId, token);
        await handleGetCartItems(token);
        toast.success(`Berhasil menambahkan ${product.name} ke keranjang!`);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };
  const openModal = () => {
    const modal = document.getElementById("cart") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  return {
    cart,
    openModal,
    handleAddToCart,
  };
}
