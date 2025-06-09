"use client"
import authStore from "@/zustand/store";

export default function dashboardPage() {
  const email = authStore((state) => state.email); 

  return (
    <main>
      <div>Selamat datang</div>
      <div>{email}</div>
    </main>
  );
}