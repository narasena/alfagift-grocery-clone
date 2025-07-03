"use client";

import { useRouter } from "next/navigation";

export default function TransactionStatusTabs({ active }: { active: string }) {
  const statuses: { label: string; value: string; path: string }[] = [
    { label: "Menunggu Pembayaran", value: "WAITING_FOR_PAYMENT", path: "/waiting-payment" },
    { label: "Sedang Diproses", value: "PROCESSING", path: "/order-in-process" },
    { label: "Dikirim", value: "DELIVERING", path: "/order-sent" },
    { label: "Selesai", value: "CONFIRMED", path: "/order-done" },
    { label: "Batal", value: "CANCELED", path: "/order-cancelled" },
  ];

  const router = useRouter();

  const handleStatusClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-nowrap gap-2 whitespace-nowrap">
        {statuses.map((status) => {
          const isActive = status.value === active;
          return (
            <button
              key={status.value}
              onClick={() => handleStatusClick(status.path)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                isActive
                  ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
