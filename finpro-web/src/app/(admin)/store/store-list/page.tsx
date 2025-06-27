"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import instance from "../../../../utils/axiosinstance";
import { useRouter } from "next/navigation";
import authStore from "../../../../zustand/authStore";
import { toast } from "react-toastify";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
}

export default function StoreListPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();
  const role = authStore.getState().role;
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = authStore.getState().token;
        if (!token) {
          toast.error("Token tidak ditemukan, silakan login ulang.");
          router.push("/admin/login");
          return;
        }

        const res = await instance.get("/store/all-store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStores(res.data);
      } catch (error) {
        console.error("Gagal mengambil data store:", error);
        toast.error("Gagal mengambil data store");
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (role !== "SuperAdmin") {
      toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini");
      router.push("/dashboard");
    }
  }, [role, router]);
  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Daftar Semua Store</h1>

      {stores.length === 0 ? (
        <p>Belum ada store terdaftar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <p className="text-sm text-gray-600">
                {store.address}, {store.city}, {store.province}
              </p>
              <Link href={`/store/${store.id}`} className="text-blue-600 text-sm mt-2 inline-block">
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
