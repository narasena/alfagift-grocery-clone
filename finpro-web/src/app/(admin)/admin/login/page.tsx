"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { authValidationSchema } from "../../../features/auth/schemas/authValidationSchema";
import instance from "../../../../utils/axiosinstance";
import { toast } from "react-toastify";
import authStore from "../../../../zustand/authStore";
import { useRouter } from "next/navigation";

interface iHandleAuthLogin {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = authStore((state) => state.setAuth);
  const router = useRouter();

  const handleAdminLogin = async ({ email, password }: iHandleAuthLogin) => {
    try {
      const response = await instance.post("/admins/login", {
        email,
        password,
      });
      console.log(response);
      toast.success(response.data.message);

      setAuth({
        token: response.data.data.token,
        email: response.data.data.email,
        id: response.data.data.adminId,
        role: response.data.data.role, 
      });

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login gagal, cek email/password.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm border h-auto border-gray-400 rounded-lg p-7">
        <h2 className="text-center text-black text-lg font-medium">Admin Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={authValidationSchema}
          onSubmit={(values) => {
            handleAdminLogin({
              email: values.email,
              password: values.password,
            });
          }}
        >
          <Form className="space-y-3 pt-6">
            <div className="pt-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Email Admin</label>
              <Field
                name="email"
                type="text"
                placeholder="Ketik email admin"
                className="w-full px-4 py-2 border text-gray-700 placeholder:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm pt-1" />
            </div>

            <div className="pt-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition mt-4"
            >
              Login Admin
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
