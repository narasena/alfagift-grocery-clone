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

  const { orderHistory } = useOrder("WAITING_FOR_PAYMENT");

  return (
    <div>
      {orderHistory && orderHistory.length > 0 ? (
        orderHistory.map((order: any) => (
          <OrderCard
            key={order.id}
            orderId={order.id}
            createdAt={order.createdAt}
            latestStatus={order.latestStatus}
            firstName={order.firstName}
            numberOfProducts={order.numberOfProducts}
            finalTotalAmount={order.finalTotalAmount}
          />
        ))
      ) : (
        <p>Tidak ada pesanan.</p>
      )}
    </div>
  );
}
