import * as React from "react";
import { getPendingPayments } from "../api/handleGetPendingPayment";
import { IPendingPayment } from "@/types/payment/payment.type";

export default function usePaymentProof() {
  const [pendingUsers, setPendingUsers] = React.useState<IPendingPayment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ordersPerPage = 5;

  const handleGetPendingPayment = async () => {
    setLoading(true);
    try {
      const response = await getPendingPayments();
      setPendingUsers(response.data); // assuming `data` has `{ data: [...] }`
    } catch (error: any) {
      console.log("Error loading");
    } finally {
      setLoading(false);
    }
  };

  const paginatedOrders = pendingUsers.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(pendingUsers.length / ordersPerPage);
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
  React.useEffect(() => {
    handleGetPendingPayment();
  }, []);

  return {
    pendingUsers,
    loading,
    handleNext,
    handlePrevious,
    totalPages,
    currentPage,
    paginatedOrders,
  };
}
