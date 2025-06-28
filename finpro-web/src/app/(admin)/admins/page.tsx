"use client";
import { useAdminsAdmin } from "@/features/admin/admins/hooks/useAdminsAdmin";
import ActiveTabs from "@/features/admin/components/ActiveTabs";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import * as React from "react";
import { HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";

export default function AdminAdminsManagerPage() {
  const { activeTab, tabHeaders, handleClickTab } = useAdminsAdmin();
  

  return (
    <div>
      <AdminPageTitle title="Admins & Users Manager" subTitle="Users and Admins Management Panel" />
      <div className="p-4 my-2 gap-4 border border-gray-700 rounded-lg">
        {/* title tabs */}
        <ActiveTabs activeTab={activeTab} tabHeaders={tabHeaders} handleClickTab={(key) => handleClickTab(key as "admins" | "users")} />
      </div>
    </div>
  );
}
