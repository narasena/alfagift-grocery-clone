"use client";

import authStore from "../../zustand/authStore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const clearAuth = authStore((state) => state.clearAuth);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("auth-storage"); // <- dari authStore
    localStorage.removeItem("selectedStore");
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-black text-xl mb-4">Profile</h1>
      <button onClick={handleSignOut} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
}
