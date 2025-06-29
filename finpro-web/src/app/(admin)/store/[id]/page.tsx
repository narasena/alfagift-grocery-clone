"use server";

import { notFound } from "next/navigation";
import instance from "../../../../utils/axiosinstance";
import DeleteStoreButton from "../../../../components/DeleteStoreButton";
import Link from "next/link";

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
  params: { id: string };
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  let store: Store;

  try {
    const res = await instance.get(`/store/${params.id}`);
    store = res.data;
  } catch (error) {
    return notFound();
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-2">{store.name}</h1>
      <p className="text-gray-700 mb-1">{store.address}</p>
      <p className="text-gray-700 mb-1">
        {store.city}, {store.province}
      </p>
      {store.latitude && store.longitude && (
        <p className="text-sm text-gray-500">
          Lokasi: ({store.latitude}, {store.longitude})
        </p>
      )}

      <div className="mt-4 flex gap-4">
        <Link 
          href={`/store/${store.id}/edit`} 
          className="text-blue-600 underline text-sm hover:text-blue-800"
        >
          Edit Store
        </Link>

        <DeleteStoreButton storeId={store.id} />
      </div>
    </div>
  );
}