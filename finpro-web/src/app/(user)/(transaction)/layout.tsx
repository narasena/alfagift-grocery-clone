"use client";

import { useSearchParams } from "next/navigation";
import TransactionSidebar from "@/components/TransactionSidebar";
import TransactionStatusTabs from "@/components/TransactionStatusTabs";

export default function TransactionLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status") || "WAITING_FOR_PAYMENT";

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen max-h-full">
      <TransactionSidebar />

      <main className="flex flex-col px-5 py-5">
        <TransactionStatusTabs active={activeStatus} />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
