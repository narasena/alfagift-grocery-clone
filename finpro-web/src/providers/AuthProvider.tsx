"use client";

import { useEffect, useState } from "react";
import authStore from "../zustand/authStore";
import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import instance from "../utils/axiosinstance";

interface DecodedToken {
  userId?: string;
  adminId?: string;
  email: string;
  role?: "SuperAdmin" | "Admin";
  isEmailVerified?: boolean;
  exp?: number;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const token = authStore((state) => state.token);
  const setAuth = authStore((state) => state.setAuth);
  const clearAuth = authStore((state) => state.clearAuth);
  const router = useRouter();
  const pathName = usePathname();
  const [isHandleSessionLoginDone, setIsHandleSessionLoginDone] =
    useState(false);

  const handleSessionLogin = async () => {
    try {
      // Decode token untuk tahu ini user atau admin
      const decoded: DecodedToken = jwtDecode(token!);

      // Tentukan endpoint berdasarkan payload
      const endpoint = decoded.adminId
        ? "/admins/session-login"
        : "/user/session-login";

      const response = await instance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;

      setAuth({
        token: data.token,
        email: data.email,
        id: data.adminId || data.userId,
        role: data.role || null,
      });

      setIsHandleSessionLoginDone(true);
    } catch (error) {
      // Reset auth jika gagal
      // clearAuth();
      console.log("Gagal handle session login");
      console.log(error);
      setIsHandleSessionLoginDone(true);
    }
  };

  // Pertama kali dijalankan
  useEffect(() => {
    if (token) {
      handleSessionLogin();
    } else {
      setIsHandleSessionLoginDone(true);
    }
  }, [token]);

  // Redirect setelah handle session selesai
  useEffect(() => {
    if (isHandleSessionLoginDone && token) {
      const isPublicPath = ["/", "/login", "/register", "/admin/login"].includes(pathName);
      const isAdminPath = [
        "/admin",
        "/dashboard",
        "/discounts",
        "/products",
        "/reports",
        "/store"
      ].includes(pathName);

      const isAdmin = authStore.getState().role === "Admin" || authStore.getState().role === "SuperAdmin";
      // console.log("isAdmin", isAdmin);
      

      if (token && !isAdmin && isAdminPath) {
        router.push("/");
      } else if (!token && !isPublicPath) {
        router.push("/login");
      }
    }
  }, [token, isHandleSessionLoginDone, pathName]);

  return <>{children}</>;
}
