"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaChevronDown, FaSignInAlt, FaUserPlus, FaUserShield } from "react-icons/fa";
import authStore from "@/zustand/authStore";
import router from "next/router";

interface ProfileDropdownProps {
  mobile?: boolean;
}

export default function ProfileDropdown({ mobile }: ProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { token, clearAuth } = authStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("selectedStore");
    clearAuth();
    router.push("/");
  };

  return (
    <div className={`profile-dropdown relative ${mobile ? "w-full" : ""}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center space-x-1 text-gray-700 hover:text-red-600 focus:outline-none ${
          mobile ? "w-full px-3 py-2 justify-between" : ""
        }`}
      >
        <div className="flex items-center">
          <FaUser className="text-xl" />
          {mobile && <span className="ml-2">Profile</span>}
        </div>
        <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {token ? (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link
                href="/register-verify-email"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t mt-1 pt-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaUserShield className="mr-2" /> Admin Login
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
