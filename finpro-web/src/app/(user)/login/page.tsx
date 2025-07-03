"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { authValidationSchema } from "../features/auth/schemas/authValidationSchema";
import { toast } from "react-toastify";
import authStore from "../../../zustand/authStore";
import { useRouter } from "next/navigation";
import apiInstance from "@/utils/api/apiInstance";
import Link from "next/link";

interface iHandleAuthLogin {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = authStore((state) => state.setAuth);
  const router = useRouter();

  const handleAuthLogin = async ({ email, password }: iHandleAuthLogin) => {
    try {
      const response = await apiInstance.post("/user/login", {
        email,
        password,
      });

      toast.success(response.data.message);
      setAuth({
        token: response.data.data.token,
        email: response.data.data.email,
        id: response.data.data.userId,
        role: null,
      });

      router.push("/");
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Terjadi kesalahan";

        if (status === 404) {
          toast.error("Email Anda salah atau belum terdaftar");
        } else if (status === 401) {
          toast.error("Password Anda salah");
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Terjadi kesalahan pada jaringan");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-gray-300 rounded-lg p-6 sm:p-7 bg-white shadow-md">
        <h2 className="text-center text-gray-800 text-xl font-semibold">Masuk</h2>
        <p className="text-center text-gray-600 text-sm mt-3">
          Belum punya akun Alfagift?{" "}
          <Link href="/register-verify-email" className="text-blue-600 font-semibold">
            Daftar
          </Link>
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={authValidationSchema}
          onSubmit={(values) => {
            handleAuthLogin(values);
          }}
        >
          <Form className="space-y-3 pt-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email/No. Handphone</label>
              <Field
                name="email"
                type="text"
                placeholder="Ketik user Anda"
                className="w-full px-4 py-2 border text-gray-700 placeholder:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm pt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border text-gray-700 placeholder:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm pt-1" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 bg-white border border-gray-400 rounded-sm accent-red-600 focus:ring-2 focus:ring-red-500"
              />
              <label htmlFor="remember" className="text-gray-500">
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-semibold transition"
            >
              Masuk
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}