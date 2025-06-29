"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import instance from "@/utils/axiosinstance";

export default function RegisterVerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "verified") {
      toast.success("Email kamu berhasil diverifikasi!");
      setIsVerified(true);
    }
  }, [searchParams]);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await instance.post("/user/register-email-only", { email });
      toast.success("Link verifikasi berhasil dikirim ke email kamu.");
      setEmailSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengirim email verifikasi.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#F5F6F8]">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <Image src="/alfagift-logo.png" alt="Alfagift" width={80} height={80} className="mb-4" />
          <h1 className="text-xl font-semibold text-gray-800 mb-2 text-center">Verifikasi Email Kamu</h1>
          <p className="text-sm text-gray-600 text-center mb-4">
            Masukkan email aktif kamu untuk menerima link verifikasi.
          </p>
        </div>

        {!isVerified ? (
          <form onSubmit={handleSendVerification}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: kamu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition"
            >
              Kirim Link Verifikasi
            </button>
          </form>
        ) : (
          <div className="text-center mt-6">
            <p className="text-green-600 font-medium mb-3">Email kamu sudah diverifikasi!</p>
            <button
              onClick={() => router.push("/register")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition"
            >
              Lengkapi Data Akun Anda
            </button>
          </div>
        )}

        {emailSent && !isVerified && (
          <div className="mt-6 text-sm text-center text-gray-500">
            Link verifikasi sudah dikirim ke: <br />
            <span className="font-medium text-gray-700">{email}</span>
            <br />
            Silakan cek email kamu.
          </div>
        )}
      </div>
    </main>
  );
}
