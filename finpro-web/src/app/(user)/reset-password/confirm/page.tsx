"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import instance from "@/utils/axiosinstance";

function ConfirmResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await instance.post("/user/confirm-reset-password", {
        email,
        newPassword,
      });

      toast.success("Password berhasil direset. Silakan login kembali.");
      router.push("/login");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Gagal mereset password");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Konfirmasi Password Baru</h2>
      <form onSubmit={handleSubmit}>
        <p className="text-sm mb-2">
          Reset password untuk: <strong>{email}</strong>
        </p>
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Simpan Password Baru
        </button>
      </form>
    </div>
  );
}

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmResetPasswordForm />
    </Suspense>
  );
}
