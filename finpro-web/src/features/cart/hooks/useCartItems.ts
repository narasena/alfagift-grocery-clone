import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { handleGetCartItems } from "../api/handleGetCartItems";
import { deleteCartItem } from "../api/handleDeleteCartItems";
import { deleteAllCartItems } from "../api/handleDeleteAllCartItems";
import { updateCartItemQuantity } from "../api/handleUpdateCartItemQuantity";
import { toast } from "react-toastify";
import { IUser } from "@/types/users/user.type";
import { IAddress } from "@/types/address/address.type";
import { AxiosError } from "axios";
import usePickStoreId from "@/hooks/stores/usePickStoreId";
import { ICartItemResponse } from "@/types/carts/cartItem.type";
import useUserVoucher from "@/features/checkout/hooks/useUserVoucher";
import { EDiscountValueType, EVoucherType, IVoucher } from "@/types/vouchers/voucher.type";

export default function useCartItems() {
  const token = useAuthStore((state) => state.token);
  const [cartItems, setCartItems] = React.useState<ICartItemResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { storeId } = usePickStoreId()
  const shippingCost = React.useRef<number>(21000); //cuma dummy aja yee
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [mainAddress, setMainAddress] = React.useState<IAddress|null>(null);
  const [user, setUser] = React.useState<IUser | null>(null);
  const { vouchers } = useUserVoucher();
  const [appliedVoucher, setAppliedVoucher] = React.useState<IVoucher | null>(null);
  // const handleInitialize = React.useRef(false);

  const handleDisplayCartItems = async () => {
    try {

      if (token && storeId) {
        setLoading(true);
        const cartItems = await handleGetCartItems(token, storeId);
        // console.log("Cart items:", cartItems.data.cartItems);
        setCartItems(cartItems.data.cartItems);

        console.log("Main address:", cartItems.data.mainAddress);
        setMainAddress(cartItems.data.mainAddress);

        setUser(cartItems.data.user);

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

  const updateQuantity = async (cartItemId: string, newQuantity: number, productId: string, storeId: string) => {
    // Implement your API call to update quantity in the backend
    if (token) {
      try {
        // Validate quantity
        if (newQuantity < 1) return;

        // Call API to update quantity
        await updateCartItemQuantity(token, cartItemId, newQuantity, productId, storeId);

        // Refetch cart items to get updated calculations from backend
        await handleDisplayCartItems();
      } catch (error) {
        const errorResponse = error as AxiosError<{ message: string }>;
        // console.error("Failed to update quantity:", error);
        // // You might want to show an error toast here
        // toast.error("Gagal memperbarui jumlah barang.");
        const message = errorResponse?.response?.data?.message

        // if (message.includes("out of stock")) {
        //   toast.error("Produk habis, stok tidak mencukupi!");
        // } else if (message.includes("exceeds")) {
        //   toast.warning("Jumlah melebihi stok yang tersedia!");
        // } else {
        //   toast.error("Gagal memperbarui jumlah produk");
        // }

        toast.error(message);
        console.error("Failed to update quantity:", error);
        throw error; // Optional: re-throw for input rollback
      }
    }
  };

  const incrementQuantity = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      await updateQuantity(itemId, item.quantity + 1, item.productId, item.storeId);
    }
  };

  const decrementQuantity = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      await updateQuantity(itemId, item.quantity - 1, item.productId, item.storeId);
    }
  };

  const handleApplyVoucher = (voucher: IVoucher | null) => {
    if (appliedVoucher && voucher === appliedVoucher) {
      setAppliedVoucher(null); // cancel voucher
    } else {
      setAppliedVoucher(voucher);
    }
  };

  const subTotal = React.useMemo(() => 
    cartItems?.reduce((total, item) => {
      return total + item.subTotal
    }, 0) ?? 0, [cartItems]);
    
  const discountInPrice = React.useMemo(() => 
    cartItems?.reduce((total, item) => {
      return total + item.discountInPrice
    }, 0) ?? 0, [cartItems]);
  
  const voucherAmountOff = React.useMemo(() =>
  {
    if (appliedVoucher) {
      
      return appliedVoucher?.voucherType !== EVoucherType.FREE_SHIPPING ?
        appliedVoucher?.discountValueType === EDiscountValueType.PERCENTAGE ? (subTotal - discountInPrice) * ((appliedVoucher?.discountValue ??0)/ 100) :
          (subTotal - discountInPrice - (appliedVoucher?.discountValue ?? 0)) : 0
    }
    return 0
  }
    , [appliedVoucher]);
  
  const voucherShippingOff = React.useMemo(() => {
    if (appliedVoucher) {
      return appliedVoucher?.voucherType === EVoucherType.FREE_SHIPPING ? (shippingCost.current - (appliedVoucher?.discountValue ?? 0)) : 0
    }
    return 0
  }

    , [appliedVoucher]);
  
  const shippingCostOrder = React.useMemo(() =>
    appliedVoucher?.voucherType === EVoucherType.FREE_SHIPPING ? shippingCost.current -voucherShippingOff : shippingCost.current
    , [appliedVoucher]);
  
    const finalPrice = React.useMemo(
      () => subTotal - discountInPrice ,
      [subTotal, discountInPrice]
    );
    
  const finalPriceOrder = React.useMemo(
    () => subTotal - discountInPrice - voucherAmountOff + (shippingCost.current - voucherShippingOff),
    [subTotal, discountInPrice, appliedVoucher, voucherAmountOff, shippingCostOrder, appliedVoucher,]
  );

  

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  React.useEffect(() => {
    if (token && storeId) {
      handleDisplayCartItems();
    }
    // handleInitialize.current = true;
  }, [token, storeId]);

  return {
    cartItems,
    mainAddress,
    user,
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
    vouchers,
    subTotal,
    discountInPrice,
    finalPrice,
    finalPriceOrder,
    shippingCost,
    shippingCostOrder,
    voucherAmountOff,
    voucherShippingOff,
    appliedVoucher,
    setAppliedVoucher,
    handleApplyVoucher,
    today,
  };
}
