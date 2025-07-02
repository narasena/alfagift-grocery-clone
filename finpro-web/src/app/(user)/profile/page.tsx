"use client";

import { useState } from "react";
import ProfileSidebar from "../../../components/ProfileSidebar";
import ProfileInfo from "../../../components/ProfileInfo";
import ResetPassword from "../reset-password/page";
import useAuthStore from "@/zustand/authStore";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { token, email, id, role } = useAuthStore();

  if (!token) {
    return <div className="p-4">Harap login terlebih dahulu</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ProfileSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        email={email}
      />

      {/* Konten */}
      <div className="flex-1 p-4 md:p-6">
        {activeTab === "profile" && (
          <ProfileInfo userEmail={email} userId={id} userRole={role} />
        )}
        {activeTab === "reset-password" && <ResetPassword />}
      </div>
    </div>
  );
}
