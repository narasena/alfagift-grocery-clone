"use client";
import AdminTable from "@/features/admin/components/AdminTable";
import * as React from "react";
import { useAdminProductStockDetail } from "@/features/admin/inventories/product/hooks/useAdminProduckStockDetail";
import {
  EStockMovementType,
  IProductStockDetailForm,
  IProductStockDetailTable,
} from "@/types/inventories/product.stock.type";
import { CldImage } from "next-cloudinary";
import { toast } from "react-toastify";
import apiInstance from "@/utils/api/apiInstance";

export default function AdminInventoryByProductInStorePage() {
  const { productStockDetail, productStockDetailColumnnTitles, renderCell, stockHisoryData } =
    useAdminProductStockDetail();
  const [quantity, setQuantity] = React.useState<number | string>("");
  const [selectedMovementType, setSelectedMovementType] = React.useState<EStockMovementType>(
    EStockMovementType.STORE_IN
  );
  const [reference, setReference] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const stockMovementType = Object.keys(EStockMovementType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: EStockMovementType[key as keyof typeof EStockMovementType],
      label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
  const handleUpdateStock = async (values: IProductStockDetailForm) => {
    try {
      const response = await apiInstance.put(`/inventories/product/update-stock/${productStockDetail?.product.slug}/${productStockDetail?.storeId}`, {
        quantity: values.quantity,
        type: values.type,
        reference: values.reference,
        notes: values.notes
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock");
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-[200px_1fr] h-max">
        <div className="relative w-full">
          {productStockDetail ? (
            <CldImage
              src={productStockDetail?.product.productImage.find((image) => image.isMainImage)?.imageUrl || "#"}
              width={200}
              height={200}
              alt={productStockDetail?.product.name || ""}
              className="object-cover"
            />

          ) : (
              <div className="size-[200px] bg-gray-600 flex items-center justify-center text-xl text-gray-800">No image available</div>
          )}
        </div>
        <div className="px-2.5">
          {/* information */}
          <div className="flex items-center gap-1.5">
            <span>{`Product Name :`}</span>
            <h1 className="text-2xl font-bold">{productStockDetail?.product.name}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{`Store Name :`}</span>
            <h1 className="text-2xl font-bold">{productStockDetail?.store.name}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{`Stock :`}</span>
            <h1 className="text-2xl font-bold">{productStockDetail?.stock}</h1>
          </div>
          {/* update stock field input*/}
          <div className="h-12 w-full border-2 border-red-500 p-2 rounded-md my-6 flex items-center gap-3">
            <div className="border border-black rounded-md">
              <input
                type="number"
                className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
                placeholder="input stock"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantity(value === "" ? "" : Number(e.target.value));
                }}
              />
            </div>
            <div className="border border-black rounded-md">
              <select
                name="movementType"
                id=""
                value={selectedMovementType}
                onChange={(e) => setSelectedMovementType(e.target.value as EStockMovementType)}
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
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="border border-black rounded-md">
              <input
                type="text"
                className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
                placeholder="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* action button */}
            <div className="">
              <button className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-500 active:ring-2 active:ring-blue-500"
              onClick={() => handleUpdateStock({
                quantity: Number(quantity),
                type: selectedMovementType,
                reference: reference,
                notes: notes
              })}
              >
                Update Stock
              </button>
            </div>
          </div>
          {/* debug */}
          <div className="text-lime-600">
            <span>{`quantity : ${quantity === "" ? 0 : quantity}`}</span>
            <br />
            <span>{`selectedMovementType : ${selectedMovementType}`}</span>
            <br />
            <span>{`reference : ${reference}`}</span>
            <br />
            <span>{`notes : ${notes}`}</span>
          </div>
        </div>
      </div>

      <AdminTable
        title={`Stock Histories of ${productStockDetail?.product.name} in ${productStockDetail?.store.name}`}
        tableDescription="Stock Histories of this product in this store"
        columns={productStockDetailColumnnTitles}
        data={stockHisoryData as IProductStockDetailTable[]}
        withCheckbox={false}
        renderCell={renderCell}
      />
    </div>
  );
}
