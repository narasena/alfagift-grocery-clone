"use client";
import { useAdminProductStocksPerProduct } from "@/features/admin/inventories/product/hooks/useAdminProductStocksPerProduct";
import AdminTable from "@/features/admin/components/AdminTable";
import { IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";
import Link from "next/link";

export default function AdminInventoryByProductPage() {
  const { productStocks, productStocksListColumnTitles, getProductStocksCellValue } = useAdminProductStocksPerProduct();
  
  const product = productStocks[0]?.product;
  const totalStock = productStocks.reduce((sum, stock) => sum + (stock.stock || 0), 0);
  const storeCount = productStocks.length;
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product?.name || 'Product Inventory'}</h1>
            <p className="text-gray-600 mt-1">Stock levels across all stores</p>
          </div>
          {product && (
            <Link 
              href={`/products/${product.slug}`}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              View Product
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      {productStocks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500">Total Stock</div>
            <div className={`text-2xl font-bold ${
              totalStock <= 50 ? 'text-red-600' : totalStock <= 200 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {totalStock}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500">Available in Stores</div>
            <div className="text-2xl font-bold text-blue-600">{storeCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500">SKU</div>
            <div className="text-lg font-semibold text-gray-900">{product?.sku || 'N/A'}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {productStocks.length > 0 ? (
          <AdminTable
            columns={productStocksListColumnTitles}
            data={productStocks as IProductStockTable[]}
            getRowId={(row: IProductStockTable) => String(row.id)}
            withCheckbox={true}
            renderCell={getProductStocksCellValue}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500 text-lg mb-2">No stock data found</div>
              <div className="text-gray-400">This product is not available in any stores yet.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
