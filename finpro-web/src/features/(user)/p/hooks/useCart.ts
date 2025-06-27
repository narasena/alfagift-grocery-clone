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

  const handleAddToCart = async (
    quantity: number = 1,
    productId: string,
    storeId: string,
    product: IProductDetails
  ) => {
    const cartItem: ICartItem = {
      id: String(product.id),
      name: product.name,
      price: product.discount? product.discount.discountedPrice: product.price,
      quantity,
      image: product.productImage?.[0]?.imageUrl ?? "",
    };
    try {
      if (token) {
        await addProductToCart(productId, quantity, storeId, token);
        const updatedCartItems = await handleGetCartItems(token);
        console.log("Updated cart items:", updatedCartItems.data.cartItems);
        // setCart(updatedCartItems.data.cart.cartItems);
        // await handleGetCartItems(token);
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
  // const handleAddToCart = (product: IProductDetails, quantity: number = 1) => {
  //   const cartItem: ICartItem = {
  //     id: String(product.id),
  //     name: product.name,
  //     price: product.discount ? product.discount.discountedPrice : product.price,
  //     quantity,
  //     image: product.productImage?.[0]?.imageUrl ?? "",
  //   };

  //   const currentCart = [...cart];
  //   const indexOfItem = currentCart.findIndex((item) => item.id === cartItem.id);

  //   if (indexOfItem > -1) {
  //     // Product already exists in cart — update quantity
  //     currentCart[indexOfItem].quantity += quantity;
  //     setCart(currentCart);
  //     toast.success(`Berhasil menambahkan ${product.name} ke keranjang!`);
  //   } else {
  //     // Product does not exist — add it
  //     setCart([...cart, cartItem]);
  //     toast.success(`Berhasil menambahkan ${product.name} ke keranjang!`);
  //   }
  // };
  return {
    cart,
    openModal,
    handleAddToCart,
  };
}
