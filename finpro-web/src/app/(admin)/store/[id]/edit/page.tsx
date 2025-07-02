"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import instance from "../../../../../utils/axiosinstance";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authStore from "@/zustand/authStore";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  email: string | null;
  phoneNumber: string | null;
}

const StoreSchema = Yup.object().shape({
  name: Yup.string().required("Wajib diisi"),
  address: Yup.string().required("Wajib diisi"),
  city: Yup.string().required("Wajib diisi"),
  province: Yup.string().required("Wajib diisi"),
  email: Yup.string().email("Email tidak valid").nullable(),
  phoneNumber: Yup.string().nullable(),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

export default function EditStorePage() {
  const { id } = useParams();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });
  const role = authStore.getState().role;

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await instance.get(`/store/${id}`);
        setStore(res.data);
      } catch (err) {
        console.error("Gagal ambil data store", err);
      }
    };

    if (id) fetchStore();
  }, [id]);

  useEffect(() => {
    if (role !== "SuperAdmin") {
      toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini");
      router.push("/dashboard");
    }
  }, [role, router]);

  if (!store) return <div className="p-6 text-black">Memuat data toko...</div>;

  return (
    <div className="p-6 text-black max-w-xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Edit Store</h1>

      <Formik
        initialValues={{
          name: store.name || "",
          address: store.address || "",
          city: store.city || "",
          province: store.province || "",
          email: store.email || "",
          phoneNumber: store.phoneNumber || "",
          latitude: store.latitude ?? null,
          longitude: store.longitude ?? null,
        }}
        validationSchema={StoreSchema}
        onSubmit={async (values) => {
          try {
            await instance.put(`/store/${id}`, values);
            toast.success("Detail store berhasil diperbarui!");
            setTimeout(() => {
              router.push(`/store/${id}`);
            }, 2000); // delay sedikit agar toast sempat muncul
          } catch (err) {
            console.error("Gagal update store", err);
            toast.error("Gagal memperbarui detail store!");
          }
        }}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => (
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Nama Store</label>
              <Field name="name" className="w-full border px-3 py-2 rounded-md" />
              {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold">Alamat</label>
              <Field name="address" className="w-full border px-3 py-2 rounded-md" />
              {touched.address && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-semibold">Kota</label>
              <Field name="city" className="w-full border px-3 py-2 rounded-md" />
              {touched.city && errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-semibold">Provinsi</label>
              <Field name="province" className="w-full border px-3 py-2 rounded-md" />
              {touched.province && errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            </div>

            <div>
              <label className="block font-semibold">Email (opsional)</label>
              <Field name="email" type="email" className="w-full border px-3 py-2 rounded-md" />
              {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-semibold">Nomor Telepon (opsional)</label>
              <Field name="phoneNumber" className="w-full border px-3 py-2 rounded-md" />
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">Latitude</label>
              <input
                name="latitude"
                value={values.latitude ?? ""}
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold">Longitude</label>
              <input
                name="longitude"
                value={values.longitude ?? ""}
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>

            <div className="pt-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Pilih Lokasi di Peta (Opsional)</label>
              <MapPicker setFieldValue={setFieldValue} />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
