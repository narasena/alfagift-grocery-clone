"use client";

import AdminListTable from "@/features/admin/products/list/components/AdminListTable";
import { useAdminProductList } from "@/features/admin/products/list/hooks/useAdminProductsList";
import { IProductDetailsTable } from "@/types/products/product.type";
import * as React from "react";

export default function AdminProductListViewPage() {
  const { products, productsListTitle, columnTitles, getProductCellValue } = useAdminProductList();
  return (
    <div className="p-4 bg-red-200">
      <AdminListTable
        title="Admin Products List View"
        tableDescription={`List of all products that are registered within the system. To view stocks / inventories, please click `}
        linkHref="#"
        linkLabel="here."
        columns={columnTitles}
        data={products as IProductDetailsTable[]}
        withCheckbox={true}
        renderCell={getProductCellValue}
      />
    </div>
  );
}
