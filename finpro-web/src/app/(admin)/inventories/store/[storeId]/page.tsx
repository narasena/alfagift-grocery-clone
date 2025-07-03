"use client";
import { useAdminProductStocksPerStore } from "@/features/admin/inventories/store/hooks/useAdminProductStocksPerStore";
import AdminTable from "@/features/admin/components/AdminTable";
import { EStockMovementType, IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";

export default function AdminInventoryByStorePage() {
  const {
    storeStocks,
    storeName,
    storeStocksListColumnTitles,
    checkedRows,
    massEdit,
    setMassEdit,
    stockMovementType,
    toBeUpdatedStocks,
    handleCheckboxChange,
    getStoreStocksCellValue,
    storeStocksUpdateFormsColumnTitles,
    getStoreStocksUpdateFormsCellValue,
    massQuantity,
    massType,
    massReference,
    massNotes,
    handleMassQuantityChange,
    handleMassTypeChange,
    handleMassReferenceChange,
    handleMassNotesChange,
    handleUpdateStocks,
  } = useAdminProductStocksPerStore();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
            <p className="text-gray-600 mt-1">Manage inventory for this store</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              massEdit 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            onClick={() => setMassEdit(!massEdit)}
          >
            {massEdit ? 'Cancel Mass Edit' : 'Mass Edit'}
          </button>
        </div>
      </div>

      {/* Mass Edit Controls */}
      {massEdit && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mass Update Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter quantity"
                value={massQuantity}
                onChange={(e) => handleMassQuantityChange(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={massType}
                onChange={(e) => handleMassTypeChange(e.target.value as EStockMovementType)}
              >
                <option value="">Select Type</option>
                {stockMovementType.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Reference"
                value={massReference}
                onChange={(e) => handleMassReferenceChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Notes"
                value={massNotes}
                onChange={(e) => handleMassNotesChange(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateStocks}
                disabled={toBeUpdatedStocks.length === 0}
              >
                Update ({toBeUpdatedStocks.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {storeStocks.length > 0 ? (
          <AdminTable
            columns={massEdit ? storeStocksUpdateFormsColumnTitles : storeStocksListColumnTitles}
            data={storeStocks as IProductStockTable[]}
            withCheckbox={true}
            getRowId={(row) => String(row.productId)}
            checkedRows={checkedRows}
            onCheckboxChange={handleCheckboxChange}
            renderCell={massEdit ? getStoreStocksUpdateFormsCellValue : getStoreStocksCellValue}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500 text-lg mb-2">No products found</div>
              <div className="text-gray-400">This store doesn't have any products yet.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
