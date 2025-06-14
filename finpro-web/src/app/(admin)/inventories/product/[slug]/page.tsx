"use client";
import { useAdminProductStocksPerProduct } from "@/features/admin/inventories/product/hooks/useAdminProductStocksPerProduct";
import AdminListTable from "@/features/admin/products/list/components/AdminListTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryByProductPage() {
  const { productStocks, productStocksListColumnTitles, getProductStocksCellValue } = useAdminProductStocksPerProduct();
  console.log(productStocks);
  return (
    <div>
      {productStocks.length > 0 && (
        <AdminListTable
          title={`Product Stocks of: ${productStocks[0]?.product.name || ""}`}
          tableDescription={`View product page `}
          linkHref={`/p/${productStocks[0]?.product.slug}` || "#"}
          linkLabel={`here.`}
          columns={productStocksListColumnTitles}
          data={productStocks as IProductStockTable[]}
          withCheckbox={true}
          renderCell={getProductStocksCellValue}
        />
      )}
    </div>
  );
}
