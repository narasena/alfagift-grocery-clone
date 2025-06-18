"use client";
import { useAdminProductInventoriesList } from "@/features/admin/inventories/overview/hooks/useAdminProductsInventoriesList";
import AdminTable from "@/features/admin/components/AdminTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryOverviewPage() {
  const { stocks, stocksListColumnTitles, getStockCellValue } = useAdminProductInventoriesList();

  return (
    <div>
      <AdminTable
        title="Admin Stock Inventories List View"
        tableDescription={`List of all products stocks that are currently available within the system. To view all products list details, please click `}
        linkHref="/products/list"
        linkLabel="here."
        columns={stocksListColumnTitles}
        data={stocks as IProductStockTable[]}
        getRowId={(row: IProductStockTable) => String(row.productId+"_"+row.storeId)}
        withCheckbox={true}
        renderCell={getStockCellValue}
      />
    </div>
  );
}
