"use client";

import OrderCard from "@/components/OrderCard";
import useOrder from "@/features/order/hooks/useOrder";

export default function OrderDonePage() {
  const { paginatedOrders, handleNext, handlePrevious, totalPages, currentPage, handleGetOrderDetails } =
    useOrder("CANCELED");

  return (
    <div className="space-y-4">
      {paginatedOrders && paginatedOrders.length > 0 ? (
        <>
          {paginatedOrders.map((order: any) => (
            <OrderCard
              key={order.id}
              orderId={order.id}
              createdAt={order.createdAt}
              latestStatus={order.latestStatus}
              firstName={order.firstName}
              lastName={order.lastName}
              numberOfProducts={order.numberOfProducts}
              finalTotalAmount={order.finalTotalAmount}
              onDetailClick={handleGetOrderDetails}
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
        </>
      ) : (
        <p>Tidak ada pesanan.</p>
      )}
    </div>
  );
}
