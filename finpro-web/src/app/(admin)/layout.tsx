"use client";
import AdminBottonNavBar from "@/features/admin/components/AdminBottomNavBar";
import AdminSideNavBar from "@/features/admin/components/AdminSideNavBar";
import * as React from "react";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative lg:grid lg:grid-cols-[280px_1fr] overflow-x-auto h-screen bg-white max-lg:pb-20">
      <AdminSideNavBar/>
      <div className="px-4">{children}</div>
      <AdminBottonNavBar/>
    </div>
  );
}
