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
import { AxiosError } from "axios";

export default function AdminInventoryByProductInStorePage() {
  const { productStockDetail, productStockDetailColumnnTitles, renderCell, stockHisoryData } =
    useAdminProductStockDetail();
  const [quantity, setQuantity] = React.useState<number | string>("");
  const [selectedMovementType, setSelectedMovementType] = React.useState<EStockMovementType>(
    EStockMovementType.STORE_IN
  );
  const [reference, setReference] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const stockMovementType = Object.keys(EStockMovementType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: EStockMovementType[key as keyof typeof EStockMovementType],
      label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
    
  const handleUpdateStock = async (values: IProductStockDetailForm) => {
    if (!quantity || quantity === 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await apiInstance.put(`/inventories/product/update-stock/${productStockDetail?.product.slug}/${productStockDetail?.storeId}`, {
        quantity: values.quantity,
        type: values.type,
        reference: values.reference,
        notes: values.notes
      });
      toast.success(response.data.message || "Stock updated successfully");
      // Reset form
      setQuantity("");
      setReference("");
      setNotes("");
      // Refresh page data
      window.location.reload();
    } catch (error) {
      const errResponse = error as AxiosError<{ message: string }>
      console.error("Error updating stock:", error);
      const errorMessage = errResponse.response?.data?.message || "Error updating stock";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStock = productStockDetail?.stock || 0;
  const stockStatus = currentStock <= 10 ? 'low' : currentStock <= 50 ? 'medium' : 'high';
  const stockColor = stockStatus === 'low' ? 'text-red-600' : stockStatus === 'medium' ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="p-6 space-y-6">
      {/* Product Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          <div className="flex justify-center lg:justify-start">
            {productStockDetail ? (
              <CldImage
                src={productStockDetail?.product.productImage.find((image) => image.isMainImage)?.imageUrl || "#"}
                width={200}
                height={200}
                alt={productStockDetail?.product.name || ""}
                className="object-cover rounded-lg border"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg border">
                No image available
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{productStockDetail?.product.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{productStockDetail?.store.name}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Current Stock</div>
                <div className={`text-2xl font-bold ${stockColor}`}>{currentStock}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">SKU</div>
                <div className="text-lg font-semibold">{productStockDetail?.product.sku || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-lg font-semibold">Rp {(productStockDetail?.product.price || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Update Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value === "" ? "" : Number(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={selectedMovementType}
              onChange={(e) => setSelectedMovementType(e.target.value as EStockMovementType)}
            >
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
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleUpdateStock({
                quantity: Number(quantity),
                type: selectedMovementType,
                reference: reference,
                notes: notes
              })}
              disabled={isUpdating || !quantity}
            >
              {isUpdating ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Stock History Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Stock History</h3>
          <p className="text-gray-600 mt-1">Track all stock movements for this product</p>
        </div>
        <AdminTable
          columns={productStockDetailColumnnTitles}
          data={stockHisoryData as IProductStockDetailTable[]}
          withCheckbox={false}
          renderCell={renderCell}
        />
      </div>
    </div>
  );
}
