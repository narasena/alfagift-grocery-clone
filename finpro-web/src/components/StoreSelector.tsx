"use client";

import { useRouter } from "next/navigation";
import useStoreStore from "../zustand/storeStore";
import { useEffect, useState } from "react";
import instance from "../utils/axiosinstance";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";

export default function StoreSelector() {
  const { selectedStore, setSelectedStore } = useStoreStore();
  const [checkingLocation, setCheckingLocation] = useState(false);
  const router = useRouter();

  const handleLocationPermission = async () => {
    setCheckingLocation(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await instance.get(
              `/store/nearest-store?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            setSelectedStore(res.data);
            toast.success("Toko ditemukan berdasarkan lokasi Anda");
          } catch (err) {
            toast.error("Gagal mencari toko dari lokasi");
          } finally {
            setCheckingLocation(false);
          }
        },
        () => {
          toast.error("Akses lokasi ditolak, diarahkan ke toko utama");
          router.push("/store/main");
          setCheckingLocation(false);
        }
      );
    } else {
      toast.warn("Geolocation tidak tersedia di perangkat Anda");
      setCheckingLocation(false);
    }
  };

  const handleChangeAddress = () => {
    router.push("/address-select");
  };

  return (
    <div className="bg-gray-100 px-4 py-2 text-sm flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-1">
        <FaLocationDot /> 
        <span className="text-gray-700 font-semibold">
           {selectedStore ? selectedStore.name : "Lokasi belum dipilih"}.
        </span>
        <button
          className="text-blue-600 hover:underline ml-1"
          onClick={handleChangeAddress}
        >
          Klik untuk ubah lokasi
        </button>
      </div>
    </div>
  );
}
