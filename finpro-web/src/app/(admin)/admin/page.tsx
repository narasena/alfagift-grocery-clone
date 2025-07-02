// FRONTEND - app/(admin)/admin-inventory/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import instance from "@/utils/axiosinstance";
import authStore from "@/zustand/authStore";
import { toast } from "react-toastify";

interface Admin {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string;
  role: string;
  store: {
    name: string;
    city: string;
  };
}

export default function AdminInventoryPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const role = authStore((state) => state.role);
  const token = authStore((state) => state.token);
  const [authReady, setAuthReady] = useState(false);

  // Tunggu hingga role/token tersinkron dengan benar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthReady(true);
    }, 100); // bisa disesuaikan jika perlu
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authReady && role !== "SuperAdmin") {
      toast.error("Akses ditolak: hanya SuperAdmin yang dapat mengakses halaman ini");
      router.push("/dashboard");
    }
  }, [authReady, role, router]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await instance.get("/admins/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data.admins);
      } catch (err) {
        toast.error("Gagal memuat data admin");
      } finally {
        setLoading(false);
      }
    };

    if (authReady && role === "SuperAdmin") {
      fetchAdmins();
    }
  }, [token, authReady, role]);


  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📋 Data Admin Toko</h1>

        <div className="flex flex-col md:flex-row justify-end gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/register-admin")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ➕ Register Admin
          </button>
          <button
            onClick={() => router.push("/admin/kelola-admin")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            ⚙️ Kelola Admin Store
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg bg-white">
              <thead className="bg-gray-200 text-sm">
                <tr>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Telepon</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Store</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="text-sm text-center">
                    <td className="border px-4 py-2">{admin.firstName} {admin.lastName ?? ""}</td>
                    <td className="border px-4 py-2">{admin.email}</td>
                    <td className="border px-4 py-2">{admin.phoneNumber}</td>
                    <td className="border px-4 py-2">{admin.role}</td>
                    <td className="border px-4 py-2">{admin.store?.name}, {admin.store?.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
