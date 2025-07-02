"use client";

import { useRouter } from "next/navigation";
import authStore from "../../../zustand/authStore";
import { useEffect } from "react";


export default function AdminDashboardPage() {
  const email = authStore((state) => state.email);
  const router = useRouter();
  const clearAuth = authStore((state) => state.clearAuth);

  const handleSignOut = () => {
    clearAuth(); 
    router.push('/admin/login');
  };

  useEffect(() => {
    if (!email){
      router.push('/admin/login');
    }
  }, [email, router]);

  return (
    <main className="text-black p-6">
      <h1 className="text-xl font-semibold">Selamat datang</h1>
      <p className="mt-2">Email Anda: <strong>{email}</strong></p>

      <button
        onClick={handleSignOut}
        className="btn btn-primary mt-4"
      >
        Logout
      </button>
    </main>
  );
}
