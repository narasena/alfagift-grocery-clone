"use client";
import SearchBar from "@/components/filters/SearchBar";
import ActiveTabs from "@/features/admin/components/ActiveTabs";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import AdminTable from "@/features/admin/components/AdminTable";
import { useAdminReport } from "@/features/admin/reports/hooks/useAdminReport";
import { EStockMovementType } from "@/types/inventories/product.stock.type";
import { TProductStockReportTable } from "@/types/products/product.type";
import * as React from "react";

export default function AdminReportPage() {
  const {
    activeTab,
    setActiveTab,
    tabHeaders,
    stocksReport,
    stockTableTitles,
    updateFilters,
    renderStockCell,
    stores,
    filters,
    stocksPagination,
    updateSearachFiltersDebounced,
    months,
    stocksReportType,
    handleStocsReportTypeChange,
  } = useAdminReport();
  
  console.log('Current filters:', filters);
  console.log('Available stores:', stores.map(s => ({ id: s.id, name: s.name })));

  return (
    <div>
      <AdminPageTitle title="Reports Manager" subTitle="List view of available reports" />
      <ActiveTabs tabHeaders={tabHeaders} defaultTab="sales" onTabChange={(activeTab) => setActiveTab(activeTab)} />
      {/* filter bar */}
      <div className="p-4 border-gray-600 rounded-lg shadow-md flex items-center justify-start gap-3">
        {/* searchbar */}
        <SearchBar value={filters.search} onChange={(value) => updateSearachFiltersDebounced(value)} />
        {/* store */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Store</label>
          <select
            onChange={(e) => {
              updateFilters({ storeId: e.target.value });
              console.log(e.target.value);
            }}
            value={filters.storeId || ""}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            {stores.map((store) => (
              <option key={store.id} value={String(store.id)}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        {/* movement type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Movement Type</label>
          <select
            onChange={(e) => {
              updateFilters({ type: e.target.value });
              console.log(e.target.value);
            }}
            value={filters.storeId || ""}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Movement Type</option>
            {Object.keys(EStockMovementType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {/* month filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            onChange={(e) => updateFilters({ month: e.target.value })}
            value={filters.month || ""}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4 flex items-center gap-4">
        {["total", "monthly"].map((value, index) => (
          <div key={index} className="flex items-center my-4">
            <input
              id={`default-radio-${index + 1}`}
              type="radio"
              value={value}
              checked={stocksReportType === value}
              onChange={() => handleStocsReportTypeChange(value)}
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
            />
            <label htmlFor={`default-radio-${index + 1}`} className="ms-2 text-sm font-medium text-gray-90">
              {value === "total" ? "Total" : "Monthly"}
            </label>
          </div>
        ))}
      </div>
      {activeTab === "sales" && <div className="bg-red-200 p-4">sales</div>}

      <div></div>
      {activeTab === "stock" && stocksReport && (
        <div className="bg-green-100 p-4">
          <div>{stocksReport.length} products in stock</div>
          <AdminTable
            columns={stockTableTitles}
            data={stocksReport as TProductStockReportTable[]}
            renderCell={renderStockCell}
          />
        </div>
      )}
      {/* pagination */}
      <nav className="w-full centered">
        <ul className="inline-flex -space-x-px text-sm">
          <li className="pagination-item">Previous</li>
          {Array.from({ length: Math.max(1, stocksPagination.current) }, (_, index) => (
            <li key={index} className="pagination-item" onClick={() => updateFilters({ page: String(index + 1) })}>
              {index + 1}
            </li>
          ))}
          <li className="pagination-item">Next</li>
        </ul>
      </nav>
    </div>
  );
}
