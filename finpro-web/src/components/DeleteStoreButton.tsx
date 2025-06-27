"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import instance from "../utils/axiosinstance";

interface Props {
  storeId: string;
}

export default function DeleteStoreButton({ storeId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus store ini?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await instance.delete(`/store/${storeId}`);

      if (res.status === 200) {
        toast.success("Store berhasil dihapus!");
        router.push("/store/store-list");
        router.refresh(); // Refresh to update the UI
      } else {
        toast.error("Gagal menghapus store!");
      }
    } catch (error) {
      console.error("Gagal menghapus store:", error);
      toast.error("Terjadi kesalahan saat menghapus store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 underline text-sm disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Hapus Store"}
    </button>
  );
}