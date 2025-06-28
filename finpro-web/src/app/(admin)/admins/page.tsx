"use client";
import { useAdminsAdmin } from "@/features/admin/admins/hooks/useAdminsAdmin";
import ActiveTabs from "@/features/admin/components/ActiveTabs";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import * as React from "react";
import { HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";

export default function AdminAdminsManagerPage() {
  const { tabHeaders, activeTab, setActiveTab } = useAdminsAdmin();
  

  return (
    <div>
      <AdminPageTitle title="Admins & Users Manager" subTitle="Users and Admins Management Panel" />
      <div className="p-4 my-2 gap-4 border border-gray-700 rounded-lg">
        {/* title tabs */}
        <ActiveTabs 
          tabHeaders={tabHeaders} 
          defaultTab="admins"
          onTabChange={(activeTab) => setActiveTab(activeTab)} 
        />
        
        {/* Conditional rendering based on active tab */}
        {activeTab === "admins" && (
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <h3>Admins Content</h3>
          </div>
        )}
        
        {activeTab === "users" && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <h3>Users Content</h3>
          </div>
        )}
      </div>
    </div>
  );
}
