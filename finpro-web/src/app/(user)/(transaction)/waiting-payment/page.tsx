"use client";

import OrderCard from "@/components/OrderCard";
import useOrder from "@/features/order/hooks/useOrder";

export default function WaitingForPaymentPage() {
  // const orders = [
  //   {
  //     id: "O-250519-AGBZZFX",
  //     createdAt: "11 Mei 2025 - 13:31 WIB",
  //     status: "Menunggu Pembayaran",
  //     userName: "Nama Pengguna",
  //     numberOfProducts: 3,
  //     finalTotalAmount: 142600,
  //   },
  //   {
  //     id: "O-250520-XYZ123",
  //     createdAt: "12 Mei 2025 - 10:20 WIB",
  //     status: "Menunggu Pembayaran",
  //     userName: "Nama Pengguna",
  //     numberOfProducts: 1,
  //     finalTotalAmount: 56000,
  //   },
  // ];

  const { paginatedOrders, handleNext, handlePrevious, totalPages, currentPage } = useOrder("WAITING_FOR_PAYMENT");

  return (
    // <div>
    //   {orderHistory && orderHistory.length > 0 ? (
    //     orderHistory.map((order: any) => (
    //       <OrderCard
    //         key={order.id}
    //         orderId={order.id}
    //         createdAt={order.createdAt}
    //         latestStatus={order.latestStatus}
    //         firstName={order.firstName}
    //         lastName={order.lastName}
    //         numberOfProducts={order.numberOfProducts}
    //         finalTotalAmount={order.finalTotalAmount}
    //       />
    //     ))
    //   ) : (
    //     <p>Tidak ada pesanan.</p>
    //   )}
    // </div>
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
