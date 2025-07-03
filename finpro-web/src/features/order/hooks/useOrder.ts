import * as React from "react";
import useAuthStore from "@/zustand/authStore";
import { toast } from "react-toastify";
import { createOrder } from "../api/handleCreateOrder";
import { getOrderByStatus } from "../api/handleGetOrderByStatus";
import { IOrder, IOrderCards, IOrderDetailsResponse } from "@/types/orders/orders.type";
import { useSearchParams } from "next/navigation";
import { getOrderDetails } from "../api/handleGetOrderDetails";

export default function useOrder(statusForPage?: string) {
  const token = useAuthStore((state) => state.token);
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "WAITING_FOR_PAYMENT";
  const [order, setOrder] = React.useState<IOrder | null>(null);
  const [orderHistory, setOrderHistory] = React.useState<IOrderCards[]>([]);
  const [orderDetails, setOrderDetails] = React.useState<IOrderDetailsResponse|null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ordersPerPage = 5;

  // create order
  const handleCreateOrder = async (shippingAddressId: string, storeId: string, voucherId?: string) => {
    try {
      if (token) {
        // setLoading(true);
        const response = await createOrder(token, shippingAddressId, storeId, voucherId);
        setOrder(response.order);
        toast.success(`Barang berhasil dipesan!`);
        return response.order.id;
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      // setLoading(false);
    }
  };

  // display Order By Status
  const handleGetOrderByStatus = async (status: string) => {
    try {
      if (token) {
        const response = await getOrderByStatus(token, status);
        setOrderHistory(response.ordersWithDetails);
        console.log("Orders by status: ", response.ordersWithDetails);
      }
    } catch (error) {
      console.error("Failed to fetch orders by status:", error);
      toast.error("Gagal menampilkan pesanan berdasarkan status.");
    }
  };

  // const handleApplyVoucher = (voucher: IVoucher) => {
  //   if (order) {
  //     setAppliedVoucher(voucher);
  //     setOrderWithVoucher((prevOrder: IOrder | null) => {
  //       if (!prevOrder) return null;
  //       const newDiscountedTotalAmount = voucher.voucherType !== EVoucherType.FREE_SHIPPING ?
  //         voucher.discountValueType === EDiscountValueType.PERCENTAGE ? voucher?.discountValue ?? 0 * (prevOrder.discountedTotalAmount / 100) :
  //           (prevOrder.discountedTotalAmount - (voucher.discountValue ?? 0)):0
  //       const newDiscounteShippingCost = voucher.voucherType === EVoucherType.FREE_SHIPPING ? prevOrder.discountedshippingCost - (voucher.discountValue??0) : 0;

  //       const newOrder = {
  //         ...prevOrder,
  //         discountedTotalAmount: newDiscountedTotalAmount,
  //         discountedshippingCost: newDiscounteShippingCost,
  //         finalTotalAmount: prevOrder.totalAmount - newDiscountedTotalAmount,
  //         finalShippingCost: prevOrder.shippingCost - newDiscounteShippingCost,
  //       };
  //       return newOrder;

  //     })

  //   }
  // };

  React.useEffect(() => {
    if (statusForPage) {
      handleGetOrderByStatus(statusForPage);
    }
  }, [statusForPage, token]);

  const paginatedOrders = orderHistory.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(orderHistory.length / ordersPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // display order details
  const handleGetOrderDetails = async (orderId: string) => {
    try {
      if (token) {
        const data = await getOrderDetails(token, orderId);
        setOrderDetails(data);
      }
    } catch (error) {
      console.error("Failed to get order details:", error);
    }
  };

  return {
    orderDetails,
    status,
    totalPages,
    currentPage,
    paginatedOrders,
    handleNext,
    handlePrevious,
    orderHistory,
    order,
    isSummaryOpen,
    setIsSummaryOpen,
    handleCreateOrder,
    handleGetOrderDetails,
  };
}
