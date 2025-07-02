"use client";

export default function TransactionStatusTabs({ active }: { active: string }) {
  const statuses = ["Menunggu Pembayaran", "Sedang Diproses", "Dikirim", "Selesai", "Batal"];

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-nowrap gap-2 whitespace-nowrap">
        {statuses.map((status) => {
          const isActive = status === active;
          return (
            <button
              key={status}
              className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                isActive
                  ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
