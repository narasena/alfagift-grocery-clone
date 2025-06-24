"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authStore from "../zustand/authStore";
import { toast } from "react-toastify";

export default function withSuperAdminProtection<P>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const role = authStore((state) => state.role);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (role !== "SuperAdmin") {
        toast.error("Akses ditolak: Hanya SuperAdmin yang dapat mengakses halaman ini.");
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    }, [role, router]);

    if (loading || role !== "SuperAdmin") return null;

    return <WrappedComponent {...props} />;
  };
}