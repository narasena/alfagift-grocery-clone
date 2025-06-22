import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import * as React from "react";

export default function AdminDiscountLayout({ children }: { children: React.ReactNode }) {
  const discountsManagerMenu = [];

  return (
    <div>
      <div>
        <AdminPageTitle
          title="Discounts & Promos Manager"
          subTitle="List view of available discounts shcemes and promotions"
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
