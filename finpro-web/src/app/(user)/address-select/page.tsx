"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useStoreStore from "@/zustand/storeStore";
import instance from "@/utils/axiosinstance";
import { AxiosError } from "axios";
import useAuthStore from "@/zustand/authStore";
import { FaTrash, FaEdit, FaStar } from "react-icons/fa";

interface Address {
  id: string;
  address: string;
  city: string;
  subDistrict: string;
  isMainAddress: boolean;
}

export default function SelectAddressPage() {
  const { token } = useAuthStore();
  const { setSelectedStore } = useStoreStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.warning("Silakan login terlebih dahulu untuk memilih alamat.");
      router.push("/login");
    }
  }, [token, router]);

  const fetchUserAddresses = async () => {
    try {
      const res = await instance.get("/address/user-addresses");
      setAddresses(res.data);
      setShowAddresses(true);
    } catch (err) {
      const errResponse = err as AxiosError<{ message: string }>;
      if (errResponse.response?.status === 404) {
        toast.info("Kamu belum punya alamat. Silakan isi terlebih dahulu.");
        router.push("/address-form");
      } else {
        toast.error("Gagal mengambil alamat Anda");
      }
    }
  };

  const handleDeclineAccess = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/store/main");
      const mainStore = res.data;
      setSelectedStore(mainStore);
      localStorage.setItem("selectedStore", JSON.stringify(mainStore));
      toast.success("Menggunakan toko pusat");
      router.push("/");
    } catch {
      toast.error("Gagal mengambil toko utama");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (addressId: string) => {
    setLoading(true);
    try {
      const res = await instance.get(`/store/nearest-by-address/${addressId}`);
      const nearestStore = res.data.nearestStore;
      setSelectedStore(nearestStore);
      localStorage.setItem("selectedStore", JSON.stringify(nearestStore));
      toast.success("Toko ditemukan dari alamat Anda");
      router.push("/");
    } catch {
      toast.error("Gagal mencari toko dari alamat");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await instance.delete(`/address/${id}`);
      toast.success("Alamat berhasil dihapus");
      fetchUserAddresses();
    } catch {
      toast.error("Gagal menghapus alamat");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/address/edit/${id}`);
  };

  const handleSetMain = async (id: string) => {
    try {
      await instance.put(`/address/set-main/${id}`);
      toast.success("Alamat utama diperbarui");
      fetchUserAddresses();
    } catch {
      toast.error("Gagal mengatur alamat utama");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-center">Pilih Alamat Pengantaran Anda</h2>

      {/* Tombol Akses */}
      <div className="space-y-3 mb-6">
        <button
          onClick={fetchUserAddresses}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Izinkan Akses Lokasi
        </button>

        <button
          onClick={handleDeclineAccess}
          disabled={loading}
          className="w-full border border-gray-400 text-gray-800 hover:bg-gray-100 py-2 rounded font-medium"
        >
          Gunakan Toko Pusat
        </button>
      </div>

      {/* Daftar alamat (hanya muncul setelah klik izinkan akses) */}
      {showAddresses && (
        <div className="space-y-3">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="relative border border-gray-300 hover:border-blue-500 px-4 py-3 rounded shadow-sm bg-white"
              >
                <div onClick={() => handleSelectAddress(addr.id)} className="cursor-pointer pr-12">
                  <p className="text-sm font-semibold">{addr.address}</p>
                  <p className="text-xs text-gray-600">{addr.subDistrict}, {addr.city}</p>
                  {addr.isMainAddress && (
                    <span className="text-xs text-green-600 font-semibold">Alamat Utama</span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  {!addr.isMainAddress && (
                    <button onClick={() => handleSetMain(addr.id)} className="text-yellow-500">
                      <FaStar />
                    </button>
                  )}
                  <button onClick={() => handleEdit(addr.id)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500">Kamu belum memiliki alamat tersimpan.</p>
          )}
        </div>
      )}

      {/* Tombol tambah alamat */}
      {showAddresses && (
        <div className="mt-6">
          <button
            onClick={() => router.push("/address-form")}
            className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 py-2 rounded font-medium"
          >
            + Tambah Alamat Baru
          </button>
        </div>
      )}

      {/* Tombol kembali */}
      <div className="mt-4 text-center">
        <button onClick={() => router.back()} className="text-sm text-blue-500 hover:underline">
          ← Kembali
        </button>
      </div>
    </div>
  );
}
