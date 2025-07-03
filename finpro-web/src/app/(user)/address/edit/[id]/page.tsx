"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import instance from "@/utils/axiosinstance";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/zustand/authStore";

interface Address {
  id: string;
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string | null;
  longitude: string | null;
  isMainAddress: boolean;
}

const AddressSchema = Yup.object().shape({
  address: Yup.string().required("Wajib diisi"),
  subDistrict: Yup.string().required("Wajib diisi"),
  district: Yup.string().required("Wajib diisi"),
  city: Yup.string().required("Wajib diisi"),
  province: Yup.string().required("Wajib diisi"),
  postalCode: Yup.string().required("Wajib diisi"),
  latitude: Yup.string().nullable(),
  longitude: Yup.string().nullable(),
});

export default function EditAddressPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore.getState().token;

  const [addressData, setAddressData] = useState<Address | null>(null);
  const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

  useEffect(() => {
    if (!token) {
      toast.warning("Silakan login terlebih dahulu.");
      router.push("/login");
      return;
    }

    const fetchAddress = async () => {
      try {
        const res = await instance.get(`/address/${id}`);
        setAddressData(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Gagal mengambil data alamat.");
        router.push("/select-address");
      }
    };

    if (id) fetchAddress();
  }, [id, token]);

  if (!addressData) return <div className="p-6 text-black">Memuat data alamat...</div>;

  return (
    <main className="max-w-screen-sm mx-auto px-4 py-6 text-black">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Edit Alamat</h1>

      <Formik
        initialValues={{
          address: addressData.address,
          subDistrict: addressData.subDistrict,
          district: addressData.district,
          city: addressData.city,
          province: addressData.province,
          postalCode: addressData.postalCode,
          latitude: addressData.latitude ?? "",
          longitude: addressData.longitude ?? "",
          isMainAddress: addressData.isMainAddress,
        }}
        validationSchema={AddressSchema}
        onSubmit={async (values) => {
          try {
            await instance.put(`/address/${id}`, values);
            toast.success("Alamat berhasil diperbarui!");
            router.push("/address-select");
          } catch {
            toast.error("Gagal memperbarui alamat.");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, errors, touched, values }) => (
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Alamat Lengkap</label>
              <Field name="address" className="w-full border px-3 py-2 rounded-md" />
              {touched.address && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Kelurahan/Desa</label>
                <Field name="subDistrict" className="w-full border px-3 py-2 rounded-md" />
                {touched.subDistrict && errors.subDistrict && <p className="text-red-500 text-sm">{errors.subDistrict}</p>}
              </div>
              <div>
                <label className="block font-semibold">Kecamatan</label>
                <Field name="district" className="w-full border px-3 py-2 rounded-md" />
                {touched.district && errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block font-semibold">Kode Pos</label>
              <Field name="postalCode" className="w-full border px-3 py-2 rounded-md" />
              {touched.postalCode && errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
            </div>

            <div className="flex gap-2 items-center">
              <Field type="checkbox" name="isMainAddress" />
              <label>Jadikan sebagai alamat utama</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Latitude</label>
                <input
                  name="latitude"
                  value={values.latitude ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label>Longitude</label>
                <input
                  name="longitude"
                  value={values.longitude ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-md bg-gray-100"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Pilih Lokasi di Peta (Opsional)
              </label>
              <MapPicker setFieldValue={setFieldValue} />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
              >
                Simpan Perubahan
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
