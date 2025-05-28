"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true); // opsional

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    birthDate: "",
    address: "",
    village: "",
    subDistrict: "",
    city: "",
    province: "",
    postcode: "",
    latitude: "",
    longitude: "",
    isMainAddress: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Nama depan wajib diisi"),
    lastName: Yup.string().required("Nama belakang wajib diisi"),
    email: Yup.string().email("Format email salah").required("Email wajib diisi"),
    phone: Yup.string().required("Nomor handphone wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").required("Password wajib diisi"),
    gender: Yup.string().required("Gender wajib dipilih"),
    birthDate: Yup.date().required("Tanggal lahir wajib diisi"),
    address: Yup.string().when("showAddressForm", {
      is: true,
      then: (schema) => schema.required("Alamat lengkap wajib diisi"),
    }),
    // Tambah validasi lain sesuai kebutuhan
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form data:", values);
    // Di sini kamu bisa panggil API pendaftaran atau actions lain
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg border h-auto border-gray-400 rounded-lg p-5 sm:p-7">
        <h2 className="text-center text-black text-lg sm:text-xl font-medium">Daftar</h2>
        <p className="text-center text-gray-600 text-sm mt-2">
          Sudah punya akun Alfagift?{" "}
          <a href="#" className="text-blue-600 font-semibold">
            Masuk
          </a>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-3 pt-4 sm:pt-6">
              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Nama Depan
                </label>
                <Field
                  name="firstName"
                  placeholder="Nama depan Anda"
                  className="w-full px-3 py-2 border border-gray-400 text-black rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Nama Belakang
                </label>
                <Field
                  name="lastName"
                  placeholder="Nama belakang Anda"
                  className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Anda"
                  className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  No. Handphone
                </label>
                <Field
                  name="phone"
                  placeholder="Nomor handphone"
                  className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Gender
                </label>
                <Field
                  as="select"
                  name="gender"
                  className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Gender</option>
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                  <option value="Lainnya">Lainnya</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Tanggal Lahir
                </label>
                <Field
                  type="date"
                  name="birthDate"
                  className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                />
                <ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
              </div>

              {showAddressForm && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-md font-medium text-gray-700">Alamat</h3>

                  <div className="pt-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">
                      Alamat Lengkap
                    </label>
                    <Field
                      name="address"
                      placeholder="Alamat lengkap"
                      className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <Field name="village" placeholder="Kelurahan/Desa" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                    <Field name="subDistrict" placeholder="Kecamatan" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <Field name="city" placeholder="Kota/Kabupaten" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                    <Field name="province" placeholder="Provinsi" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                  </div>

                  <div className="pt-2">
                    <Field name="postcode" placeholder="Kode Pos" className="w-full px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <Field name="latitude" placeholder="Latitude (opsional)" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                    <Field name="longitude" placeholder="Longitude (opsional)" className="px-3 py-2 border border-gray-400 text-black  rounded-md text-sm" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Field type="checkbox" name="isMainAddress" className="w-4 h-4 bg-white border border-gray-400 text-black  rounded-sm accent-red-600 focus:ring-2 focus:ring-red-500" />
                    <label htmlFor="isMainAddress" className="text-gray-600 text-sm">
                      Jadikan alamat utama
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-semibold transition mt-4"
              >
                Daftar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}