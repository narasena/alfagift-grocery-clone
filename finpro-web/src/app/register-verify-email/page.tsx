"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import instance from "@/utils/axiosinstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Format email salah").required("Email wajib diisi"),
  password: Yup.string().min(6, "Minimal 6 karakter").required("Password wajib diisi"),
});

export default function RegisterVerifyEmailPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendVerification = async (email: string, password: string) => {
    try {
      setLoading(true);
      await instance.post("/user/register-email-only", { email, password });
      toast.success("Link verifikasi telah dikirim ke email kamu.");
      setEmailSent(true);
      setUserEmail(email);
      setUserPassword(password);
    } catch (err) {
      const errResponse = err as AxiosError<{ message: string }>
      toast.error(errResponse?.response?.data?.message || "Gagal mengirim email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-lg font-semibold mb-4 text-center">Daftar dengan Email</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Masukkan email dan password kamu untuk menerima link verifikasi.
        </p>

        {!emailSent ? (
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await sendVerification(values.email, values.password);
            }}
          >
            <Form className="space-y-4">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full border px-4 py-3 rounded"
                />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full border px-4 py-3 rounded"
                />
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
              >
                {loading ? "Mengirim..." : "Kirim Link Verifikasi"}
              </button>
            </Form>
          </Formik>
        ) : (
          <div className="text-center text-sm text-gray-600">
            <p>Link verifikasi telah dikirim ke:</p>
            <p className="font-semibold mt-1">{userEmail}</p>

            {/* Kirim ulang */}
            <button
              className="mt-4 text-blue-500 hover:underline text-sm"
              onClick={() => sendVerification(userEmail, userPassword)}
              disabled={loading}
            >
              {loading ? "Mengirim ulang..." : "Kirim Ulang Link"}
            </button>

            <button
              onClick={() => router.push("/login")}
              className="mt-6 text-blue-600 hover:underline text-sm block w-full"
            >
              ← Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
