"use client";
import { useAdminProductStocksPerStore } from "@/features/admin/inventories/store/hooks/useAdminProductStocksPerStore";
import AdminTable from "@/features/admin/components/AdminTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryByStorePage() {
  const { storeStocks, storeName, storeStocksListColumnTitles, getStoreStocksCellValue } =
    useAdminProductStocksPerStore();
  return (
    <div>
      {storeStocks.length > 0 && (
        <AdminTable
          title={`Store Stocks of: ${storeName || ""}`}
          tableDescription={`List of all products in store `}
          columns={storeStocksListColumnTitles}
          data={storeStocks as IProductStockTable[]}
          withCheckbox={true}
          renderCell={getStoreStocksCellValue}
        />
      )}
    </div>
  );
}
