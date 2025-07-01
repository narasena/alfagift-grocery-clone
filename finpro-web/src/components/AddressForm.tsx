"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { addressValidationSchema } from "@/app/features/address/schemas/addressValidationSchema";
import instance from "@/utils/axiosinstance";
import { useRouter } from "next/navigation"; // ← Tambahkan ini
import { useEffect } from "react";

const MapPicker = dynamic(() => import("../components/MapPicker"), { ssr: false });

interface AddressFormValues {
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  isMainAddress: boolean;
}

interface AddressFormProps {
  userId: string;
}

export default function AddressForm({ userId }: AddressFormProps) {
  const router = useRouter(); // ← Gunakan router

  const initialValues: AddressFormValues = {
    address: "",
    subDistrict: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    isMainAddress: false,
  };

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      await instance.post("/address", { ...values, userId });
      toast.success("Alamat berhasil disimpan!");
      setTimeout(() => {
        router.push("/address-select"); 
      }, 1500);
    } catch (error: any) {
      console.error("Gagal menyimpan alamat:", error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan alamat.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center bg-white px-4 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg border border-gray-400 rounded-lg p-5 sm:p-7">
          <h2 className="text-center text-black text-lg sm:text-xl font-medium">Tambah Alamat Pengiriman</h2>

          <Formik initialValues={initialValues} validationSchema={addressValidationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue }) => (
              <Form className="space-y-3 pt-4 sm:pt-6">
                <div className="pt-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Alamat Lengkap</label>
                  <Field
                    name="address"
                    placeholder="Alamat lengkap"
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <Field
                    name="subDistrict"
                    placeholder="Kelurahan/Desa"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                  <Field
                    name="district"
                    placeholder="Kecamatan"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <Field
                    name="city"
                    placeholder="Kota/Kabupaten"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                  <Field
                    name="province"
                    placeholder="Provinsi"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                </div>

                <div className="pt-2">
                  <Field
                    name="postalCode"
                    placeholder="Kode Pos"
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-md text-sm"
                  />
                  <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <Field
                    name="latitude"
                    placeholder="Latitude"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm bg-gray-100"
                    readOnly
                  />
                  <Field
                    name="longitude"
                    placeholder="Longitude"
                    className="px-3 py-2 border border-gray-400 text-black rounded-md text-sm bg-gray-100"
                    readOnly
                  />
                </div>

                <div className="pt-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Pilih Lokasi di Peta</label>
                  <MapPicker setFieldValue={setFieldValue} />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Field
                    type="checkbox"
                    name="isMainAddress"
                    className="w-4 h-4 bg-white border border-gray-400 text-black rounded-sm accent-blue-600"
                  />
                  <label htmlFor="isMainAddress" className="text-gray-600 text-sm">
                    Jadikan alamat utama
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition mt-4"
                >
                  Simpan Alamat
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
