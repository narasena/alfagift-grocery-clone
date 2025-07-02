"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authStore from "../../../zustand/authStore";

export default function AdminDashboardPage() {
  const email = authStore((state) => state.email);
  const role = authStore((state) => state.role);
  const clearAuth = authStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/admin/login");
  };

  useEffect(() => {
    if (!email) {
      router.push("/admin/login");
    }
  }, [email, router]);

  return (
    <main className="relative min-h-screen bg-gray-100 text-gray-800 px-4 py-6 md:px-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          🎉 Selamat Datang, Admin!
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Anda masuk sebagai <span className="font-medium">{email}</span>
        </p>
      </header>

      {/* Content */}
      <section className="bg-white rounded-lg shadow p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-2">📊 Dashboard Perusahaan</h2>
        <p className="text-sm text-gray-700 mb-4">
          Ini adalah pusat kendali untuk mengelola semua aktivitas di dalam sistem.
          Anda bisa mengakses data toko, mengatur admin, melihat performa penjualan, dan lainnya.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-blue-700">Kelola Store</h3>
            <p className="text-sm text-gray-600">Tambah, edit, atau hapus toko dalam sistem.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-green-700">Admin Toko</h3>
            <p className="text-sm text-gray-600">Atur akun admin untuk masing-masing store.</p>
          </div>

          {/* Bisa tambah panel lain di sini */}
        </div>
      </section>

      {/* Logout Button */}
      <div className="fixed bottom-6 right-4 md:right-10">
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
