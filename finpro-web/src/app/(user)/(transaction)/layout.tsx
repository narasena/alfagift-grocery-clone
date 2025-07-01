export default function TransactionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[280px_1fr] h-screen max-h-full">
      <div className="w-full bg-red-600 min-h-full"></div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
