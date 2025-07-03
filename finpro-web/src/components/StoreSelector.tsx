"use client";

import { useRouter } from "next/navigation";
import useStoreStore from "../zustand/storeStore";
import { FaLocationDot } from "react-icons/fa6";

export default function StoreSelector() {
  const { selectedStore } = useStoreStore();
  const router = useRouter();

  const handleChangeAddress = () => {
    router.push("/address-select");
  };

  return (
    <div className="bg-gray-100 px-4 md:px-24 py-2 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-gray-200">
      <div className="flex flex-wrap items-center gap-2 text-gray-700 font-semibold">
        <FaLocationDot className="text-gray-600" />
        <span>
          {selectedStore ? selectedStore.name : "Lokasi belum dipilih"}
        </span>
        <button
          className="text-blue-600 hover:underline font-normal"
          onClick={handleChangeAddress}
        >
          Klik untuk ubah lokasi
        </button>
      </div>
    </div>
  );
}