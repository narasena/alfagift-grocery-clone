"use client";
import { useAdminProductStocksPerStore } from "@/features/admin/inventories/store/hooks/useAdminProductStocksPerStore";
import AdminTable from "@/features/admin/components/AdminTable";
import { EStockMovementType, IProductStockTable } from "@/types/inventories/product.stock.type";
import * as React from "react";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";

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
    handleUpdateStocks
  } = useAdminProductStocksPerStore();

  return (
    <div>
      <div className="px-2.5">
        {/* information */}
        <div className="flex items-center gap-1.5">
          <span>{`Store Name :`}</span>
          <h1 className="text-2xl font-bold">{storeName}</h1>
        </div>
        {/* mass edit toggle */}

        <div>
          <button
            className="py-2 px-4 bg-red-700 hover:bg-red-500 active:ring-3 active:ring-blue-500 text-white font-bold rounded-md"
            onClick={() => setMassEdit(!massEdit)}
          >
            Mass Edit
          </button>
        </div>
        {/* update stock field input*/}
        <div
          className={`h-12 w-full border-2 border-red-500 p-2 rounded-md my-6 items-center gap-3 ${
            massEdit ? "flex" : "hidden"
          }`}
        >
          <div className="border border-black rounded-md">
            <input
              type="number"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="input stock"
              value={massQuantity}
              onChange={(e) => {
                const value = handleMassQuantityChange(Number(e.target.value));
              }}
            />
          </div>
          <div className="border border-black rounded-md">
            <select
              name="movementType"
              id=""
              value={massType}
              onChange={(e) => handleMassTypeChange(e.target.value as EStockMovementType)}
            >
              <option value="">Select Stock Movement Type</option>
              {stockMovementType.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="border border-black rounded-md">
            <input
              type="text"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="reference"
              value={massReference}
              onChange={(e) => handleMassReferenceChange(e.target.value)}
            />
          </div>
          <div className="border border-black rounded-md">
            <input
              type="text"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="notes"
              value={massNotes}
              onChange={(e) => handleMassNotesChange(e.target.value)}
            />
          </div>

          {/* action button */}
          <div className="">
            <button
              className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-500 active:ring-2 active:ring-blue-500"
              onClick={handleUpdateStocks}
            >
              Update Stock
            </button>
          </div>
        </div>
        {/* debug */}
        <div className="text-lime-600">
          <span>{`data: ${toBeUpdatedStocks.length}`}</span>
          <br />
          <span>{`toBeUpdatedStocks : ${JSON.stringify(toBeUpdatedStocks)}`}</span>
        </div>
      </div>
      {massEdit === false && storeStocks.length > 0 && (
        <AdminTable
          title={`Store Stocks of: ${storeName || ""}`}
          tableDescription={`List of all products in store `}
          columns={storeStocksListColumnTitles}
          data={storeStocks as IProductStockTable[]}
          withCheckbox={true}
          getRowId={(row) => row.productId}
          onCheckboxChange={handleCheckboxChange}
          renderCell={getStoreStocksCellValue}
        />
      )}
      {massEdit === true && storeStocks.length > 0 && (
        <AdminTable
          title={`Mass Update Products Stocks of: ${storeName || ""}`}
          tableDescription={`Update products stocks in store `}
          columns={storeStocksUpdateFormsColumnTitles}
          data={storeStocks as IProductStockTable[]}
          withCheckbox={true}
          getRowId={(row) => String(row.productId)}
          checkedRows={checkedRows}
          onCheckboxChange={handleCheckboxChange}
          renderCell={getStoreStocksUpdateFormsCellValue}
        />
      )}
    </div>
  );
}
