"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useStoreStore from "@/zustand/storeStore";
import instance from "@/utils/axiosinstance";
import { AxiosError } from "axios";

interface Address {
  id: string;
  address: string;
  city: string;
  subDistrict: string;
  isMainAddress: boolean;
  
}

export default function SelectAddressPage() {
  const { setSelectedStore } = useStoreStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUserAddresses = async () => {
    try {
      const res = await instance.get("/address/user-addresses");
      setAddresses(res.data);
    } catch (err) {
      const errResponse = err as AxiosError<{ message: string }>
      if (errResponse.response?.status === 404) {
        toast.info("Kamu belum punya alamat. Silakan isi terlebih dahulu.");
        router.push("/address-form"); // atau "/registrasi" sesuai kebutuhanmu
      } else {
        toast.error("Gagal mengambil alamat Anda");
      }
    }
  };

  const handleAllowAccess = async () => {
    setShowAddresses(true);
    await fetchUserAddresses(); // ini akan otomatis redirect kalau kosong
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

  return (
    <div className="max-w-md mx-auto px-4 py-6 text-gray-800">
      <h2 className="text-lg font-semibold mb-4">📍 Lokasi Anda</h2>

      <div className="bg-white rounded shadow p-4 space-y-4 border">
        <button
          onClick={handleAllowAccess}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Izinkan Akses (Pilih Alamat Saya)
        </button>

        <div className="text-center text-sm text-gray-500">atau</div>

        <button
          onClick={handleDeclineAccess}
          disabled={loading}
          className="w-full border border-gray-400 text-gray-800 hover:bg-gray-100 py-2 rounded font-medium"
        >
          Tidak Izinkan (Gunakan Toko Pusat)
        </button>
      </div>

      {/* Daftar alamat muncul setelah user klik "Izinkan" */}
      {showAddresses && (
        <div className="mt-6 space-y-3">
          <p className="font-medium text-sm">Pilih alamat Anda:</p>

          {addresses.length > 0 ? (
            <>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr.id)}
                  className="cursor-pointer border border-gray-300 hover:border-blue-500 px-4 py-3 rounded shadow-sm bg-white"
                >
                  <p className="text-sm font-semibold">{addr.address}</p>
                  <p className="text-xs text-gray-600">
                    {addr.subDistrict}, {addr.city}
                  </p>
                  {addr.isMainAddress && <span className="text-xs text-green-600 font-semibold">Alamat Utama</span>}
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">Kamu belum memiliki alamat tersimpan.</p>
          )}

          {/* Tambah alamat baru */}
          <button
            onClick={() => router.push("/address-form")}
            className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 py-2 rounded font-medium mt-2"
          >
            + Tambah Alamat Baru
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button onClick={() => router.back()} className="text-sm text-blue-500 hover:underline">
          ← Kembali
        </button>
      </div>
    </div>
  );
}
