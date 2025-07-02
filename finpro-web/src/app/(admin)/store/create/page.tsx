"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import dynamic from "next/dynamic";
import instance from "../../../../utils/axiosinstance";
import { toast } from "react-toastify";
import { storeValidationSchema } from "../../../(user)/features/store/schemas/storeValidationSchema";
import { useRouter } from "next/navigation";
import authStore from "../../../../zustand/authStore";
import { useEffect } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const MapPicker = dynamic(() => import("../../../../components/MapPicker"), { ssr: false });

interface FormValues {
  name: string;
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  email: string;
}

const initialValues: FormValues = {
  name: "",
  address: "",
  subDistrict: "",
  district: "",
  city: "",
  province: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  phoneNumber: "",
  email: "",
};

const inputClass =
  "form-input w-full border border-black placeholder-gray-300 text-sm px-3 py-2 rounded-md";

export default function CreateStorePage() {
  const router = useRouter();
  const role = authStore.getState().role;

  useEffect(() => {
    if (role !== "SuperAdmin") {
      toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini");
      router.push("/dashboard");
    }
  }, [role, router]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const formattedPhone = values.phoneNumber.replace(/\D/g, "");

      const payload = {
        ...values,
        phoneNumber: formattedPhone || null,
        email: values.email || null,
        lat: values.latitude || null,
        lon: values.longitude || null,
        subDistrict: values.subDistrict || null,
        district: values.district || null,
        postalCode: values.postalCode || null,
      };

      const res = await instance.post("/store", payload);
      toast.success("Store berhasil dibuat");
      router.push("/store/store-list");
    } catch (error) {
      const errResponse = error as AxiosError<{ message: string }>;
      toast.error(errResponse.response?.data?.message || "Gagal membuat store.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 mt-6 text-black bg-white border rounded-lg shadow-sm">
      {/* Tombol Back */}
      <div className="mb-4">
        <Link
          href="/store/store-list"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <FaArrowLeft /> Kembali ke Daftar Store
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Tambah Store Baru</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={storeValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nama Store</label>
              <Field name="name" className={inputClass} placeholder="Nama Store" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Nomor Telepon</label>
              <Field
                name="phoneNumber"
                className={inputClass}
                placeholder="Contoh: 081234567890 atau +6281234567890"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("phoneNumber", e.target.value)
                }
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
              <p className="text-xs text-gray-500 mt-1">
                Format: 081234567890 atau +6281234567890
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium">Email (Opsional)</label>
              <Field name="email" className={inputClass} placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Alamat Lengkap</label>
              <Field name="address" className={inputClass} placeholder="Alamat Lengkap" />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="subDistrict" className={inputClass} placeholder="Kelurahan/Desa" />
              <Field name="district" className={inputClass} placeholder="Kecamatan" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="city" className={inputClass} placeholder="Kota/Kabupaten" />
              <Field name="province" className={inputClass} placeholder="Provinsi" />
            </div>

            <Field name="postalCode" className={inputClass} placeholder="Kode Pos" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                name="latitude"
                value={values.latitude}
                className={inputClass}
                placeholder="Latitude"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    setFieldValue("latitude", value);
                  }
                }}
              />

              <Field
                name="longitude"
                value={values.longitude}
                className={inputClass}
                placeholder="Longitude"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    setFieldValue("longitude", value);
                  }
                }}
              />
            </div>

            <div className="h-64 w-full relative z-0">
              <label className="block text-sm font-medium mb-2">Pilih Lokasi di Peta</label>
              <MapPicker setFieldValue={setFieldValue} />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
