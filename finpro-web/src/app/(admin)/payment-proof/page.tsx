"use client";

import * as React from "react";
import usePaymentProof from "@/features/admin/payment-proof/hooks/usePaymentProof";
import PaymentProofModal from "@/features/admin/payment-proof/components/PaymentProofModal";

export default function PendingPaymentsPage() {
  const {
    paginatedOrders,
    handleNext,
    handlePrevious,
    totalPages,
    currentPage,
    loading,
    // handleGetPaymentProof,
    handleDetailClick,
    paymentImage,
    handleAcceptPayment,
    handleRejectPayment,
    actionLoading,
    isModalOpen,
    closeModal,
  } = usePaymentProof();

  if (loading) {
    return <p className="p-4 text-gray-600">Loading pending payments...</p>;
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Payments</h1>

      {paginatedOrders && paginatedOrders.length > 0 ? (
        <>
          {paginatedOrders.map((user: any) => (
            <div key={user.orderId} className="rounded-lg border border-gray-200 p-5 shadow-sm mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-sm text-gray-500">No. Ref: {user.orderId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Belanja</p>
                  <p className="text-sm font-semibold">{user.numberOfProducts} Produk</p>
                  <p className="text-lg font-bold text-red-600">Rp {user.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <hr className="border-t border-gray-200 my-4" />

              <div className="flex flex-wrap justify-end items-center gap-2">
                <button
                  className="bg-white text-red-600 border border-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg"
                  onClick={() => handleDetailClick(user.paymentId)}
                >
                  Lihat Bukti Pembayaran
                </button>

                <button
                  onClick={() => handleAcceptPayment(user.paymentId)}
                  disabled={actionLoading === user.paymentId}
                  className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {actionLoading === user.paymentId ? "Processing..." : "Accept"}
                </button>

                <button
                  onClick={() => handleRejectPayment(user.paymentId)}
                  disabled={actionLoading === user.paymentId}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {actionLoading === user.paymentId ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}

          <PaymentProofModal isOpen={isModalOpen} onClose={closeModal} paymentProofs={paymentImage} />
        </>
      ) : (
        <p className="p-4 text-gray-600">No pending payments found.</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded transition 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded transition
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}
