"use client";

import instance from "../utils/axiosinstance";
import { useEffect, useState } from "react";
import authStore from "../zustand/store";
import { useRouter, usePathname } from "next/navigation";
import apiInstance from "@/utils/api/apiInstance";

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = authStore((state) => state.token);
  const setAuth = authStore((state) => state.setAuth);
  const pathName = usePathname();
  const router = useRouter();
  const [isHandleSessionLoginDone, setIsHandleSessionLoginDone] =
  useState(false);

  const handleSessionLogin = async () => {
    try {
      const response = await apiInstance.get("/user/session-login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth({
        _token: response.data.data.token,
        _email: response.data.data.user,
        _id: response.data.data.userId,
      });
      setIsHandleSessionLoginDone(true);
    } catch (error) {
      console.error(error);
      setAuth({
        _token: null,
        _email: null,
        _id: null,
      });
      setIsHandleSessionLoginDone(true);
    }
  };

    // Dijalankan Pertama Kali
  useEffect(() => {
    if (token) {
      handleSessionLogin();
    } else {
      setIsHandleSessionLoginDone(true);
    }
  }, [token]);

    useEffect(() => {
    if (isHandleSessionLoginDone) {
      const isPublicPath = ["/", "/login", "/register"].includes(pathName);
      if (token && pathName === "/") {
        router.push("/main");
      } else if (!token && !isPublicPath) {
        router.push("/");
      }
    }
  }, [isHandleSessionLoginDone, pathName]);

// const handleProtectPage = () => {
//   if (token && pathName === '/') return router.push('/main')
// }

//  const handleProtectPageNeedToLogin = () => {
//    if (!token && pathName !== '/') return router.push('/')
//  }

//   useEffect(() => {
//     if (token) {
//       handleSessionLogin();
//       handleProtectPage();
//     }
//   }, [token]);

//   useEffect(()=> {
//     handleProtectPageNeedToLogin()
//   }, [pathName]);

  return <div>{children}</div>;
}
