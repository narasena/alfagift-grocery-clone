"use server";

import { notFound } from "next/navigation";
import instance from "../../../../utils/axiosinstance";
import DeleteStoreButton from "../../../../components/DeleteStoreButton";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
}

interface StoreDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { id } = await params;
  let store: Store;

  try {
    const res = await instance.get(`/store/${id}`);
    store = res.data;
  } catch (error) {
    console.error(error);
    return notFound();
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-white rounded shadow-md mt-4">
      {/* Tombol Back */}
      <div className="mb-4">
        <Link
          href="/store/store-list"
          className="inline-flex items-center text-blue-600 hover:underline text-sm"
        >
          <FaArrowLeft className="mr-2" />
          Kembali ke Daftar Store
        </Link>
      </div>

      {/* Detail Store */}
      <h1 className="text-2xl font-bold mb-2 break-words">{store.name}</h1>
      <p className="text-gray-700 mb-1 break-words">{store.address}</p>
      <p className="text-gray-700 mb-1">
        {store.city}, {store.province}
      </p>

      {store.latitude && store.longitude && (
        <p className="text-sm text-gray-500">
          Lokasi: ({store.latitude}, {store.longitude})
        </p>
      )}

      {/* Aksi */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/store/${store.id}/edit`}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Edit Store
        </Link>

        <DeleteStoreButton storeId={store.id} />
      </div>
    </div>
  );
}
