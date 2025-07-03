"use client";
import * as React from "react";
import { Suspense } from "react";

import OrderCard from "@/features/order/components/OrderCard";
import useOrder from "@/features/order/hooks/useOrder";
import OrderDetailsModal from "@/features/order/components/OrderDetailsModal";
import {  IOrderCards } from "@/types/orders/orders.type";

function ProcessingOrderContent() {
  const { paginatedOrders, handleNext, handlePrevious, totalPages, currentPage, handleGetOrderDetails, orderDetails } =
    useOrder("PROCESSING");

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleDetailClick = async (orderId: string) => {
    await handleGetOrderDetails(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {paginatedOrders && paginatedOrders.length > 0 ? (
        <>
          {paginatedOrders.map((order: IOrderCards) => (
            <OrderCard
              key={order.orderId}
              orderId={order.orderId}
              createdAt={order.createdAt}
              latestStatus={order.latestStatus}
              firstName={order.firstName}
              lastName={order.lastName}
              numberOfProducts={order.numberOfProducts}
              finalTotalAmount={order.finalTotalAmount}
              onDetailClick={handleDetailClick}
            />
          ))}

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
          {orderDetails && (
            <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} orderDetails={orderDetails} />
          )}
        </>
      ) : (
        <p>Tidak ada pesanan.</p>
      )}
    </div>
  );
}

export default function ProcessingOrderPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}>
      <ProcessingOrderContent />
    </Suspense>
  );
}
