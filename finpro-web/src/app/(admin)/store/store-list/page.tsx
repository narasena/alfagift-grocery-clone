"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import instance from "../../../../utils/axiosinstance";
import { useRouter } from "next/navigation";
import authStore from "../../../../zustand/authStore";
import { toast } from "react-toastify";
import { FaPlus, FaSearch } from "react-icons/fa";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
}

export default function StoreListPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const role = authStore.getState().role;

  // Fetch store
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
        setFilteredStores(res.data);
      } catch (error) {
        console.error("Gagal mengambil data store:", error);
        toast.error("Gagal mengambil data store");
      }
    };

    fetchStores();
  }, []);

  // Role check
  useEffect(() => {
    if (role !== "SuperAdmin") {
      toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini");
      router.push("/dashboard");
    }
  }, [role, router]);

  // Search Handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setSearchQuery(keyword);
    const filtered = stores.filter((store) =>
      store.name.toLowerCase().includes(keyword)
    );
    setFilteredStores(filtered);
  };

  return (
    <div className="p-4 sm:p-6 text-black max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Daftar Semua Store</h1>
        <button
          onClick={() => router.push("/store/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm w-full sm:w-auto justify-center"
        >
          <FaPlus /> Tambah Store
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama store..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Store Grid */}
      {filteredStores.length === 0 ? (
        <p className="text-gray-500">Tidak ada store ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold break-words">{store.name}</h2>
              <p className="text-sm text-gray-600 break-words">
                {store.address && `${store.address}, `}
                {store.city}, {store.province}
              </p>
              <Link
                href={`/store/${store.id}`}
                className="text-blue-600 text-sm mt-2 inline-block hover:underline"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
