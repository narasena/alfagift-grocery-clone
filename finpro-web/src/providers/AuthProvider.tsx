"use client";

import instance from "../utils/axiosinstance";
import { useEffect } from "react";
import authStore from "../zustand/store";
import { headers } from "next/headers";

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = authStore((state) => state.token);
  const setAuth = authStore((state) => state.setAuth);
  const handleSessionLogin = async () => {
    try {
      const response = await instance.get("/user/session-login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth({
        _token: response.data.data.token,
        _email: response.data.data.user,
        _id: response.data.data.userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      handleSessionLogin();
    }
  }, [token]);
  return <div>{children}</div>;
}
