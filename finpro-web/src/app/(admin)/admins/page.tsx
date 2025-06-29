"use client";
import { useAdminsAdmin } from "@/features/admin/admins/hooks/useAdminsAdmin";
import ActiveTabs from "@/features/admin/components/ActiveTabs";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import AdminTable from "@/features/admin/components/AdminTable";
import { IAdminTable } from "@/types/admins/admin.type";
import { IUserTable } from "@/types/users/user.type";
import * as React from "react";

export default function AdminAdminsManagerPage() {
  const {
    tabHeaders,
    activeTab,
    setActiveTab,
    admins,
    adminTableTitles,
    renderAdminsCell,
    users,
    userTableTitles,
    renderUsersCell,
  } = useAdminsAdmin();

  return (
    <div>
      <AdminPageTitle title="Admins & Users Manager" subTitle="Users and Admins Management Panel" />
      <div className="p-4 my-2 gap-4 border border-gray-700 rounded-lg">
        {/* title tabs */}
        <ActiveTabs tabHeaders={tabHeaders} defaultTab="admins" onTabChange={(activeTab) => setActiveTab(activeTab)} />

        {/* Conditional rendering based on active tab */}
        {activeTab === "admins" && (
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <AdminTable columns={adminTableTitles} data={admins as IAdminTable[]} renderCell={renderAdminsCell} />
          </div>
        )}

        {activeTab === "users" && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <AdminTable columns={userTableTitles} data={users as IUserTable[]} renderCell={renderUsersCell} />
          </div>
        )}
      </div>
    </div>
  );
}
