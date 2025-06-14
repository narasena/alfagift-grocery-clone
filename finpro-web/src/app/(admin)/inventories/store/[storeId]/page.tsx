"use client";
import { useAdminProductStocksPerStore } from "@/features/admin/inventories/store/hooks/useAdminProductStocksPerStore";
import AdminListTable from "@/features/admin/products/list/components/AdminListTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryByStorePage() {
  const { storeStocks, storeStocksListColumnTitles, getStoreStocksCellValue } = useAdminProductStocksPerStore();
  return (
    <div>
      {storeStocks.length > 0 && (
        <AdminListTable
          title={`Store Stocks of: ${storeStocks[0]?.store.name || ""}`}
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
