"use client";
import ItemActions from "@/features/admin/category/components/ItemActions";
import { useAdminsCategory } from "@/features/admin/category/hooks/useAdminsCategory";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import * as React from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import * as Yup from "yup";



export default function AdminCategoryPage() {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    categorySchema,
    productCategories,
    productSubCategories,
    toggleTab,
    isTabOpen,
    handleCategoryChange,
    handleInputChange,
    isCategoryFormOpen,
		setIsCategoryFormOpen,
		handleSubmit
  } = useAdminsCategory();

  
  return (
    <div>
      <AdminPageTitle title="Product Category Manager" subTitle="Create, Edit and Delete Product Category" />
      <div className="p-4 my-2 lg:grid lg:grid-cols-2 gap-4 border border-gray-700 rounded-lg">
        {/* category lists */}
        <div className="border rounded-md">
          <div className="px-4 py-3 border-b border-black font-medium text-xl">Current Product Categories</div>
          <div>
            {productCategories.map((cat, index) => (
              <ul key={index} className="font-medium border border-gray-100 text-base">
                <li
                  className="flex items-center group justify-between cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-2 py-1.5"
                  onClick={() => toggleTab(cat.id)}
                >
                  <div className="flex items-center gap-1">
										<span>{cat.name}</span>
										<div className="opacity-0 pointer-events-none group-hover:opacity-80 group-hover:pointer-events-auto">

                    <ItemActions />
										</div>
                  </div>

                  {isTabOpen(cat.id) ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
                </li>
                {productSubCategories
                  .filter((sub) => sub.productCategoryId === cat.id)
                  .map((sub, indx) => (
                    <li
                      key={indx}
                      className={`${
                        isTabOpen(cat.id) ? "block" : "hidden"
                      } block font-normal border-b border-gray-500 text-sm px-4 py-0.5 bg-slate-300 text-gray-700`}
                    >
                      {sub.name}
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        </div>
        {/* add new category */}
        <div className="border rounded-md h-max">
          <div className="px-4 py-3 border-b border-black font-medium text-xl">Add Product Categories</div>
          {/* cat/sub cat toggle */}
          <div
            className="mt-3 px-3 inline-flex items-center cursor-pointer"
            onClick={() => setIsCategoryFormOpen(!isCategoryFormOpen)}
          >
            <div
              className={`relative w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-blue-600  ${
                isCategoryFormOpen ? "after:translate-x-full" : "after:translate-x-0"
              }`}
            ></div>
            <span className="ms-3 text-sm font-medium text-gray-600">
              {isCategoryFormOpen ? "Sub Category" : "Category"}
            </span>
          </div>
          {/* forms */}
          {!isCategoryFormOpen ? (
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  ${
                    errors.name ? "border-2 border-red-500" : "border border-gray-300"
                  }`}
                  placeholder="Type category name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Add New Category
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="p-4">
              <div>
                <label htmlFor="productCategoryId" className="block mb-2 text-sm font-medium text-gray-900">
                  Category
                </label>
                <select
                  id="productCategoryId"
                  name="productCategoryId"
                  value={formData.productCategoryId || 0}
                  onChange={handleCategoryChange}
                  className={`bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                    errors.productCategoryId ? "border-2 border-red-500" : "border border-gray-300"
                  }`}
                >
                  <option value={0}>Select category</option>
                  {productCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.productCategoryId && <p className="mt-1 text-sm text-red-600">{errors.productCategoryId}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Sub Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  ${
                    errors.name ? "border-2 border-red-500" : "border border-gray-300"
                  }`}
                  placeholder="Type category name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Add New Sub Category
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
