"use client";

import AdminTable from "@/features/admin/components/AdminTable";
import { useAdminProductList } from "@/features/admin/products/list/hooks/useAdminProductsList";
import { IProductDetailsTable } from "@/types/products/product.type";
import * as React from "react";

export default function AdminProductListViewPage() {
  const { products, productsListColumnTitles, getProductCellValue } = useAdminProductList();
  return (
    <div className="p-4 bg-red-200">
      <AdminTable
        title="Admin Products List View"
        tableDescription={`List of all products that are registered within the system. To view stocks / inventories, please click `}
        linkHref="inventories/overview"
        linkLabel="here."
        columns={productsListColumnTitles}
        data={products as IProductDetailsTable[]}
        getRowId={row => row.id}
        withCheckbox={true}
        renderCell={getProductCellValue}
      />
    </div>
  );
}
