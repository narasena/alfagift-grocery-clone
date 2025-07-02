import * as React from "react";
import { getPendingPayments } from "../api/handleGetPendingPayment";
import { IPendingPayment } from "@/types/payment/payment.type";
import { getPaymentProof } from "../api/handleGetPaymentProof";
import { verifyPaymentProof } from "../api/handleVerifyPaymentProof";

export default function usePaymentProof() {
  const [pendingUsers, setPendingUsers] = React.useState<IPendingPayment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [paymentImage, setPaymentImage] = React.useState<[]>([]);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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

  const handleDetailClick = async (paymentId: string) => {
    console.log("Clicked:", paymentId);

    const imageUrl = await getPaymentProof(paymentId);
    console.log(imageUrl.paymentProofs);

    if (imageUrl.paymentProofs && imageUrl.paymentProofs.length > 0) {
      setPaymentImage(imageUrl.paymentProofs);
      setIsModalOpen(true);
    } else {
      console.log("No payment proofs found");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPaymentImage([]); // Optional: clear old proofs
  };

  //   const handleGetPaymentProof = async (paymentId: string) => {
  //     try {
  //       const imageUrl = await getPaymentProof(paymentId);
  //       console.log(imageUrl.paymentProofs);

  //       setPaymentImage(imageUrl.paymentProofs);
  //     } catch (error) {
  //       console.error("Failed to get image url:", error);
  //     }
  //   };

  const handleAcceptPayment = async (paymentId: string) => {
    setActionLoading(paymentId);
    try {
      await verifyPaymentProof(paymentId, "ACCEPT");
      await handleGetPendingPayment(); // refresh list
    } catch (error) {
      console.error("Failed to accept payment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    setActionLoading(paymentId);
    try {
      await verifyPaymentProof(paymentId, "REJECT");
      await handleGetPendingPayment(); // refresh list
    } catch (error) {
      console.error("Failed to reject payment:", error);
    } finally {
      setActionLoading(null);
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
    paymentImage,
    // handleGetPaymentProof,
    handleDetailClick,
    isModalOpen,
    handleAcceptPayment,
    handleRejectPayment,
    actionLoading,
    closeModal,
  };
}
