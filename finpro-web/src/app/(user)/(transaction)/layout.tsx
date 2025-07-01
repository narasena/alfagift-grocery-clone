import TransactionSidebar from "@/components/TransactionSidebar";
import TransactionStatusTabs from "@/components/TransactionStatusTabs";

export default function TransactionLayout({
  children,
  activeStatus = "Selesai",
}: {
  children: React.ReactNode;
  activeStatus?: string;
}) {
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
