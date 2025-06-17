"use client";
import { useAdminProductStocksPerProduct } from "@/features/admin/inventories/product/hooks/useAdminProductStocksPerProduct";
import AdminTable from "@/features/admin/components/AdminTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryByProductPage() {
  const { productStocks, productStocksListColumnTitles, getProductStocksCellValue } = useAdminProductStocksPerProduct();
  console.log(productStocks);
  return (
    <div>
      {productStocks.length > 0 && (
        <AdminTable
          title={`Product Stocks of: ${productStocks[0]?.product.name || ""}`}
          tableDescription={`View product page `}
          linkHref={`/p/${productStocks[0]?.product.slug}` || "#"}
          linkLabel={`here.`}
          columns={productStocksListColumnTitles}
          data={productStocks as IProductStockTable[]}
          getRowId={(row: IProductStockTable) => String(row.id)}
          withCheckbox={true}
          renderCell={getProductStocksCellValue}
        />
      )}
    </div>
  );
}
