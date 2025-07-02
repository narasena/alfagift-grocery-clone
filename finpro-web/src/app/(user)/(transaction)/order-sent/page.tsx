"use client";

import OrderCard from "@/components/OrderCard";
import useOrder from "@/features/order/hooks/useOrder";

export default function OrderSentPage() {
  const { orderHistory } = useOrder("DELIVERING");

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
