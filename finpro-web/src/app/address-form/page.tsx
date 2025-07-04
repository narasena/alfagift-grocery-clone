"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useAuthStore from "@/zustand/authStore";

const AddressForm = dynamic(() => import("../../components/AddressForm"), {
  ssr: false,
}) as React.ComponentType<{ userId: string }>;

export default function AddressFormPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.id);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white border border-gray-300 rounded-lg p-6 shadow-md">
        <div className="mb-4">
          <button 
            onClick={() => router.push('/address-select')}
            className="text-sm text-blue-500 hover:underline flex items-center"
          >
            <span className="mr-1">←</span> Kembali
          </button>
        </div>
        
        {!userId ? (
          <div className="text-center text-gray-700">Silakan login terlebih dahulu untuk menambahkan alamat.</div>
        ) : (
          <>
            <AddressForm userId={userId} />
          </>
        )}
      </div>
    </main>
  );
}