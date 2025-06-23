"use client";
import AdminTable from "@/features/admin/components/AdminTable";
import { useAdminAddDiscounts } from "@/features/admin/discounts/add/hooks/useAdminAddDiscounts";
import { EDiscountType, TDiscountType } from "@/types/discounts/discount.type";
import { IProductDetailsTable } from "@/types/products/product.type";
import { IStore, IStoreTable } from "@/types/stores/store.type";
import * as React from "react";
import { FaSquareCaretDown, FaSquareCaretUp } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function AdminAddDiscountPage() {
  const {
    stores,
    products,
    discountTypes,
    discountType,
    setDiscountType,
    isChooseStores,
    setIsChooseStores,
    isChooseProducts,
    setIsChooseProducts,
    selectedStores,
    setSelectedStores,
    selectedProducts,
    setSelectedProducts,
    storeColumnTitles,
    productColumnTitles,
    getStoreNameCellValue,
    getProductNameCellValue,
    toBeDiscountedProducts,
    setToBeDiscountedProducts,
    handlePriceCutProductCheckbox,
    handleStoreCheckbox,
    showStoreDropDown,
    handleStoreDropDown,
    handleProductCheckBox,
    showB1G1ProductDropDown,
    handleB1G1ProductDropDown,
  } = useAdminAddDiscounts();

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new Discount Promo</h2>
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Discount Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type discount promo name"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <textarea
                id="description"
                rows={8}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Discount description here"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Discount Type
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setDiscountType(e.target.value as TDiscountType)}
              >
                <option value="">Select Discount Type</option>
                {discountTypes.map((discountType, index) => (
                  <option key={index} value={discountType}>
                    {discountType}
                  </option>
                ))}
              </select>
            </div>
            {discountType !== "" && (
              <>
                <div className="w-full">
                  <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="$2999"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    id="endDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="12"
                  />
                </div>
                <div className="w-full col-span-2">
                  <label
                    htmlFor="usageLimitPerTransaction"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {`(Optional) Usage Limit / Maximum number it can be used per transaction`}
                  </label>
                  <input
                    type="number"
                    name="usageLimitPerTransaction"
                    id="usageLimitPerTransaction"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="e.g 1 or 2 etc. Leave empty if no limit"
                  />
                </div>

                <div className="w-full col-span-2 flex items-center gap-2.5">
                  <label
                    htmlFor="isGlobalStore"
                    className="order-2 !m-0 w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Set For All Stores
                  </label>
                  <input
                    type="checkbox"
                    name="isGlobalStore"
                    id="isGlobalStore"
                    className="order-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    defaultChecked={true}
                    onChange={(e) => setIsChooseStores(!e.target.checked)}
                  />
                </div>
                {selectedStores.length > 0 && (
                  <div className="text-xs text-lime-300">
                    <span>Selected Stores:</span>
                    {stores
                      .filter((store) => selectedStores.includes(store.id))
                      .map((store, index) => (
                        <p key={index}>
                          {index + 1}-{store.name}
                        </p>
                      ))}
                  </div>
                )}
                {isChooseStores && (
                  <div className="col-span-2 relative">
                    {isChooseStores && showStoreDropDown && (
                      <AdminTable
                        columns={storeColumnTitles}
                        data={stores as IStoreTable[]}
                        withCheckbox={true}
                        noHeader
                        onCheckboxChange={handleStoreCheckbox}
                        getRowId={(row) => String(row.id)}
                        renderCell={getStoreNameCellValue}
                      />
                    )}
                    <div
                      className={`${
                        showStoreDropDown
                          ? "absolute top-0 right-0 bg-white/0 justify-end"
                          : "bg-[#374151] text-white rounded-lg justify-between"
                      } flex items-center h-10 w-full z-20 p-4 rounded-tl-lg rounded-tr-lg lg:hover:bg-slate-500/30 *:text-xl`}
                      onClick={() => handleStoreDropDown()}
                    >
                      <span className="!text-base">{showStoreDropDown ? "" : "Select Store"}</span>
                      {showStoreDropDown ? <FaSquareCaretUp /> : <FaSquareCaretDown />}
                    </div>
                  </div>
                )}
                {discountType !== "MIN_PURCHASE" && (
                  <div className="w-full col-span-2 flex items-center gap-2.5">
                    <label
                      htmlFor="isGlobalProduct"
                      className="order-2 !m-0 w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Set For All Products
                    </label>
                    <input
                      type="checkbox"
                      name="isGlobalProduct"
                      id="isGlobalProduct"
                      className="order-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      defaultChecked={true}
                      onChange={(e) => {
                        setIsChooseProducts(!e.target.checked);
                        if (!e.target.checked && toBeDiscountedProducts.length === 0) {
                          setToBeDiscountedProducts((value) => [...value, { discountValue: 0, productIds: [] }]);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
            {discountType === "MIN_PURCHASE" && (
              <div className="w-full col-span-2">
                <label
                  htmlFor="minPurchaseValue"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Minimum Purchase Value<span></span>
                </label>
                <input
                  type="number"
                  name="minPurchaseValue"
                  id="minPurchaseValue"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type minimum purchase value here"
                />
              </div>
            )}
            {["PERCENTAGE", "FIXED_AMOUNT"].includes(discountType) && (
              <>
                {!isChooseProducts && (
                  <div className={`w-full col-span-2`}>
                    <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {`Discount Value ${discountType === "PERCENTAGE" ? "(in %)" : "(in IDR)"}`}
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      id="discountValue"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type discount value"
                    />
                  </div>
                )}
                {isChooseProducts && (
                  <div className="text-xs text-lime-300">
                    Product Discounts Data:
                    {toBeDiscountedProducts.length > 0 &&
                      JSON.stringify(toBeDiscountedProducts, null, 2).replace(/"/g, "'")}
                  </div>
                )}
                {isChooseProducts &&
                  toBeDiscountedProducts.map((discountValue, index) => {
                    return (
                      <div
                        key={index}
                        className="col-span-2 grid gap-4 sm:grid-cols-[25%_1fr] sm:gap-6 sm:py-2 sm:border-b sm:border-primary-300"
                      >
                        <div className={`w-full`}>
                          <label
                            htmlFor={`discountValue-${index + 1}`}
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {`Discount Value ${discountType === "PERCENTAGE" ? "(in %)" : "(in IDR)"}`}
                          </label>
                          <input
                            type="number"
                            name={`discountValue-${index + 1}`}
                            id={`discountValue-${index + 1}`}
                            value={discountValue.discountValue}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Type discount value"
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setToBeDiscountedProducts((prev) => {
                                const newDiscounts = [...prev];
                                newDiscounts[index].discountValue = value;
                                return newDiscounts;
                              });
                            }}
                          />
                        </div>
                        <div className="my-3 overflow-x-hidden max-h-60 overflow-y-auto bg-slate-200 rounded-lg">
                          <AdminTable
                            columns={productColumnTitles}
                            data={products as IProductDetailsTable[]}
                            withCheckbox={true}
                            noHeader
                            onCheckboxChange={(products) => handlePriceCutProductCheckbox(products, index)}
                            getRowId={(row) => String(row.id)}
                            renderCell={getProductNameCellValue}
                            checkedRows={[
                              ...discountValue.productIds,
                              ...toBeDiscountedProducts
                                .filter((_, i) => i !== index)
                                .flatMap((group) => group.productIds),
                            ]}
                            disabledRows={toBeDiscountedProducts
                              .filter((_, i) => i !== index)
                              .flatMap((group) => group.productIds)}
                          />
                        </div>
                        <div className="sm:col-span-2 my-2 text-white">
                          {discountValue.productIds.length > 0 && (
                            <>
                              <span>{`Product with `}</span>{" "}
                              <b>
                                <i>{`${
                                  discountType === "PERCENTAGE"
                                    ? discountValue.discountValue
                                    : discountValue.discountValue.toLocaleString("id-ID")
                                } ${discountType === "PERCENTAGE" ? "%" : "IDR"}`}</i>
                              </b>
                              <span>{` Discounted: `}</span>
                            </>
                          )}
                          {products
                            .filter((p) => discountValue.productIds.includes(p.id))
                            .map((p, index) => (
                              <div key={index} className="text-xs text-lime-300">
                                {index + 1} - {p.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                {isChooseProducts && (
                  <button
                    type="button"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() => {
                      const lastIndex = toBeDiscountedProducts.length - 1;
                      if (toBeDiscountedProducts.length > 0) {
                        if (toBeDiscountedProducts[lastIndex].discountValue === 0) {
                          toast.error("Please add a discount value for the last product discount!");
                          return;
                        }
                        setToBeDiscountedProducts((prev) => [...prev, { discountValue: 0, productIds: [] }]);
                      }
                    }}
                  >
                    Add More Product Discounts
                  </button>
                )}
              </>
            )}
            {discountType === "BUY1_GET1" && isChooseProducts && (
              <>
                <div>
                  {products
                    .filter((p) => selectedProducts.includes(p.id))
                    .map((p, index) => (
                      <div key={index} className="text-xs text-lime-300 col-span-2 !gap-0">
                        {index + 1} - {p.name}
                      </div>
                    ))}
                </div>
                <div className="w-full col-span-2 relative">
                  {isChooseProducts && showB1G1ProductDropDown && (
                    <AdminTable
                      columns={productColumnTitles}
                      data={products as IProductDetailsTable[]}
                      withCheckbox={true}
                      noHeader
                      onCheckboxChange={(products) => handleProductCheckBox(products)}
                      getRowId={(row) => String(row.id)}
                      renderCell={getProductNameCellValue}
                    />
                  )}
                  <div
                    className={`${
                      showB1G1ProductDropDown
                        ? "absolute top-0 right-0 bg-yellow/60 justify-end"
                        : "bg-[#374151] text-white rounded-lg justify-between"
                    } flex items-center h-10 w-full z-30 p-4 rounded-tl-lg rounded-tr-lg lg:hover:bg-slate-500/30 *:text-xl`}
                    onClick={() => handleB1G1ProductDropDown()}
                  >
                    <span className="!text-base">{showB1G1ProductDropDown ? "" : "Select Product"}</span>
                    {showB1G1ProductDropDown ? <FaSquareCaretUp /> : <FaSquareCaretDown />}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex w-full justify-center items-center px-5 py-2.5 mt-4 sm:mt-6 text-base font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Create New Discount Promo
          </button>
        </form>
      </div>
    </section>
  );
}
