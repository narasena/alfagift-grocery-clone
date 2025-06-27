"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authStore from "../../zustand/authStore";

export default function DashboardPage() {
  const email = authStore((state) => state.email);
  const token = authStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  return (
    <main className="text-black">
      <div>Selamat datang</div>
      <div>{email}</div>
    </main>
  );
}
