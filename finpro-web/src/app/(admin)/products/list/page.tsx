"use client";

import AdminTable from "@/features/admin/components/AdminTable";
import { useAdminProductList } from "@/features/admin/products/list/hooks/useAdminProductsList";
import { IProductDetailsTable } from "@/types/products/product.type";
import SearchBar from "@/components/filters/SearchBar";
import * as React from "react";

export default function AdminProductListViewPage() {
  const { 
    products, 
    productsListColumnTitles, 
    getProductCellValue, 
    totalCount, 
    totalPages, 
    currentPage, 
    filters, 
    updateFilters, 
    handlePageChange,
    productCategories,
    productSubCategories
  } = useAdminProductList();
  
  const [searchTerm, setSearchTerm] = React.useState(filters.search);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchTerm, page: "1" });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredSubCategories = productSubCategories.filter(
    sub => !filters.categoryId || sub.productCategoryId === Number(filters.categoryId)
  );

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
          />
          
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value, subCategoryId: "", page: "1" })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={filters.subCategoryId}
            onChange={(e) => updateFilters({ subCategoryId: e.target.value, categoryId: "", page: "1" })}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !filters.categoryId 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white border-gray-300'
            }`}
            disabled={!filters.categoryId}
          >
            <option value="">
              {!filters.categoryId ? 'Please select category first' : 'All Subcategories'}
            </option>
            {filteredSubCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {products.length} of {totalCount} products
          </div>
        </div>
      </div>

      <AdminTable
        title="Admin Products List View"
        tableDescription={`List of all products that are registered within the system. To view stocks / inventories, please click `}
        linkHref="inventories/overview"
        linkLabel="here."
        columns={productsListColumnTitles}
        data={products as IProductDetailsTable[]}
        getRowId={row => row.id}
        withCheckbox={true}
        renderCell={getProductCellValue}
      />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm border rounded-md cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
