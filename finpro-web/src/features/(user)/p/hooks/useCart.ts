import * as React from "react";
import { ICartItem } from "@/types/carts/cartItem.type";
import { IProductDetails } from "@/types/products/product.type";
import { toast } from "react-toastify";

export default function useCart() {
  const [cart, setCart] = React.useState<ICartItem[]>([]);

  const handleAddToCart = (product: IProductDetails, quantity: number = 1) => {
    const cartItem: ICartItem = {
      id: String(product.id),
      name: product.name,
      price: product.discount? product.discount.discountedPrice: product.price,
      quantity,
      image: product.productImage?.[0]?.imageUrl ?? "",
    };

    const currentCart = [...cart];
    const indexOfItem = currentCart.findIndex((item) => item.id === cartItem.id);

    if (indexOfItem > -1) {
      // Product already exists in cart — update quantity
      currentCart[indexOfItem].quantity += quantity;
      setCart(currentCart);
      toast.success(`Berhasil menambahkan ${product.name} ke keranjang!`);
    } else {
      // Product does not exist — add it
      setCart([...cart, cartItem]);
      toast.success(`Berhasil menambahkan ${product.name} ke keranjang!`);
    }
  };
  return {
    cart,
    handleAddToCart,
  };
}
