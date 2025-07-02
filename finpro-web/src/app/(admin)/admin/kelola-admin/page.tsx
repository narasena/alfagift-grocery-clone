"use client";

import { useEffect, useState } from "react";
import instance from "@/utils/axiosinstance";
import authStore from "@/zustand/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface Store {
  id: string;
  name: string;
  city: string;
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: string;
  store: Store | null;
}

export default function KelolaAdminPage() {
  const router = useRouter();
  const { token, role } = authStore();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<{ [key: string]: string }>({});
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authReady && role !== "SuperAdmin") {
      toast.error("Akses ditolak");
      router.push("/dashboard");
    }
  }, [authReady, role, router]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await instance.get("/admins/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const onlyAdmins = res.data.admins.filter((a: Admin) => a.role === "Admin");
        setAdmins(onlyAdmins);

        const storeMap = new Map<string, Store>();
        res.data.admins.forEach((admin: Admin) => {
          if (admin.store) {
            storeMap.set(admin.store.id, admin.store);
          }
        });
        setStores(Array.from(storeMap.values()));
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data admin/store");
      } finally {
        setLoading(false);
      }
    };

    if (authReady && role === "SuperAdmin") {
      fetchAdmins();
    }
  }, [token, authReady, role]);

  const handleAssign = async (adminId: string) => {
    const storeId = selectedStore[adminId];
    if (!storeId) {
      toast.warning("Pilih store terlebih dahulu");
      return;
    }

    try {
      await instance.put(
        `/admins/${adminId}/update-store`,
        { storeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Store berhasil diperbarui");
      window.location.reload();
    } catch (err) {
      const errResponse = err as AxiosError<{ message: string }>
      toast.error(errResponse?.response?.data?.message || "Gagal update store");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">⚙️ Kelola Admin Toko</h1>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Toko Saat Ini</th>
                  <th className="p-3 border">Pindah ke Toko</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="text-center">
                    <td className="p-2 border">
                      {admin.firstName} {admin.lastName ?? ""}
                    </td>
                    <td className="p-2 border">{admin.email}</td>
                    <td className="p-2 border">{admin.store ? `${admin.store.name}, ${admin.store.city}` : "-"}</td>
                    <td className="p-2 border">
                      <select
                        className="border rounded px-2 py-1"
                        value={selectedStore[admin.id] || ""}
                        onChange={(e) => setSelectedStore({ ...selectedStore, [admin.id]: e.target.value })}
                      >
                        <option value="">Pilih Store</option>
                        {stores.map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.name} - {store.city}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleAssign(admin.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Kelola
                      </button>
                    </td>
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
