"use client";

import { FaUser, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useAuthStore from "@/zustand/authStore";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string | null;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  email,
}: ProfileSidebarProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("selectedStore");
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="w-full md:w-64 bg-white shadow-md p-4">
      {/* Header Profil */}
      <div className="flex items-center space-x-3 mb-8 p-2 border-b pb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-500 text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base">Profil Saya</h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">{email}</p>
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-3 w-full p-2 rounded-md text-sm ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaUser className="text-base" />
              <span>Profil</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("reset-password")}
              className={`flex items-center space-x-3 w-full p-2 rounded-md text-sm ${
                activeTab === "reset-password"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaLock className="text-base" />
              <span>Reset Password</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-2 rounded-md text-red-600 hover:bg-red-50 mt-4 text-sm"
            >
              <FaSignOutAlt className="text-base" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
