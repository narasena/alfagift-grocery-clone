"use client"
import authStore from "@/zustand/store";

export default function dashboardPage() {
  const email = authStore((state) => state.email); 

  return (
    <main className="text-black">
      <div>Selamat datang</div>
      <div>{email}</div>
    </main>
  );
}