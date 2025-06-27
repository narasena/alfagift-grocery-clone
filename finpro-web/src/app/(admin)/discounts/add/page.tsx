"use client";
import AdminTable from "@/features/admin/components/AdminTable";
import AdminInputField from "@/features/admin/discounts/add/components/AdminInputField";
import AdminInputFieldAsCheckbox from "@/features/admin/discounts/add/components/AdminInputFieldAsCheckbox";
import AdminInputFieldAsSelect from "@/features/admin/discounts/add/components/AdminInputFieldAsSelect";
import { useAdminAddDiscounts } from "@/features/admin/discounts/add/hooks/useAdminAddDiscounts";
import addDiscountSchema from "@/features/admin/discounts/add/schemas/addDiscountsSchema";
import { EDiscountType, IPriceCutSelectedProduct, TDiscountType } from "@/types/discounts/discount.type";
import { IProductDetailsTable } from "@/types/products/product.type";
import { IStore, IStoreTable } from "@/types/stores/store.type";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as React from "react";
import { FaSquareCaretDown, FaSquareCaretUp } from "react-icons/fa6";
import { RiMenuAddLine } from "react-icons/ri";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function AdminAddDiscountPage() {
  const {
    stores,
    products,
    discountTypes,
    storeColumnTitles,
    productColumnTitles,
    getStoreNameCellValue,
    getProductNameCellValue,
    showStoreDropDown,
    handleStoreDropDown,
    showB1G1ProductDropDown,
    handleB1G1ProductDropDown,
    addDiscountInitialValues,
    handleCreateDiscount
  } = useAdminAddDiscounts();

  return (
    <Formik
      initialValues={addDiscountInitialValues}
      validationSchema={addDiscountSchema}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log("Form Values:", values);
        console.log("Is Valid:", addDiscountSchema.isValidSync(values));
        try {
          addDiscountSchema.validateSync(values, { abortEarly: false });
          console.log("Validation passed!");
          handleCreateDiscount(values);
          setSubmitting(false);
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            console.log("Validation Errors:", err.errors);
          }
          setSubmitting(false);
        }
      }}
      className="bg-white"
    >
      {({ values, setFieldValue }) => {
        const { handlePriceCutProductCheckbox, handleStoreCheckbox, handleProductCheckBox } =
          useAdminAddDiscounts(setFieldValue);

        return (
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 className="mb-4 text-xl font-bold text-gray-900 ">Add a new Discount Promo</h2>
            <Form action="#">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <AdminInputField
                  name="name"
                  label="Discount Name"
                  type="text"
                  placeholder="Discount name here"
                  className="sm:col-span-2"
                />

                <AdminInputField
                  name="description"
                  label="Discount Promo Description"
                  as="textarea"
                  rows={8}
                  placeholder="Discount description here"
                  className="sm:col-span-2"
                />

                <AdminInputFieldAsSelect
                  name="discountType"
                  label="Discount Type"
                  className="sm:col-span-2"
                  optionTitle="Select Discount Type"
                  options={discountTypes}
                  onChange={(value) => setFieldValue("discountType", value as TDiscountType)}
                />
                {values.discountType !== "" && (
                  <>
                    <AdminInputField name="startDate" type="datetime-local" label="Start Date" className="w-full" />
                    <AdminInputField name="endDate" type="datetime-local" label="End Date" className="w-full" />
                    <AdminInputField
                      name="usageLimitPerTransaction"
                      type="number"
                      label={`(Optional) Usage Limit / Maximum number it can be used per transaction`}
                      placeholder="e.g 1 or 2 etc. Leave empty if no limit"
                      className="w-full col-span-2"
                    />

                    <AdminInputFieldAsCheckbox
                      name="isGlobalStore"
                      label="Set For All Stores"
                      defaultChecked={true}
                      onChange={(value) => setFieldValue("isGlobalStore", value)}
                    />
                    {values.selectedStores.length > 0 && (
                      <div className="text-xs text-lime-300">
                        <span>Selected Stores:</span>
                        {stores
                          .filter((store) => values.selectedStores.includes(store.id))
                          .map((store, index) => (
                            <p key={index}>
                              {index + 1}-{store.name}
                            </p>
                          ))}
                      </div>
                    )}
                    {!values.isGlobalStore && (
                      <div className="col-span-2 relative">
                        {!values.isGlobalStore && showStoreDropDown && (
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
                    {values.discountType !== "MIN_PURCHASE" && (
                      <AdminInputFieldAsCheckbox
                        name="isGlobalProduct"
                        label="Set For All Products"
                        defaultChecked={true}
                        onChange={(val) => {
                          setFieldValue("isGlobalProduct", val);
                          if (!val && (!values.toBeDiscountedProducts || values.toBeDiscountedProducts.length === 0)) {
                            setFieldValue("toBeDiscountedProducts", [{ discountValue: 0, productIds: [] }]);
                          }
                        }}
                      />
                    )}
                  </>
                )}
                {values.discountType === "MIN_PURCHASE" && (
                  <AdminInputField
                    name="minPurchaseValue"
                    type="number"
                    label="Minimum Purchase Value"
                    className="w-full col-span-2"
                    placeholder="Type minimum purchase value here"
                  />
                )}
                {["PERCENTAGE", "FIXED_AMOUNT"].includes(values.discountType) && (
                  <>
                    {values.isGlobalProduct && (
                      <AdminInputField
                        name="discountValue"
                        type="number"
                        label={`Discount Value ${values.discountType === "PERCENTAGE" ? "(in %)" : "(in IDR)"}`}
                        className="w-full col-span-2"
                        placeholder="Type discount value"
                      />
                    )}
                    {!values.isGlobalProduct && (
                      <div className="text-xs text-lime-300">
                        Product Discounts Data:
                        {values.toBeDiscountedProducts &&
                          values.toBeDiscountedProducts.length > 0 &&
                          JSON.stringify(values.toBeDiscountedProducts, null, 2).replace(/"/g, "'")}
                      </div>
                    )}
                    {!values.isGlobalProduct &&
                      values.toBeDiscountedProducts?.map((discountValue, index) => {
                        return (
                          <div
                            key={index}
                            className="col-span-2 grid gap-4 sm:grid-cols-[25%_1fr] sm:gap-6 sm:py-2 sm:border-b sm:border-primary-300"
                          >
                            <div className="w-full">
                              <label className="block mb-2 text-sm font-medium text-gray-900">
                                {`Discount Value ${values.discountType === "PERCENTAGE" ? "(in %)" : "(in IDR)"}`}
                              </label>
                              <input
                                type="number"
                                value={discountValue.discountValue || ""}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Type discount value"
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const newDiscounts = [...values.toBeDiscountedProducts];
                                  newDiscounts[index].discountValue = value;
                                  setFieldValue("toBeDiscountedProducts", newDiscounts);
                                }}
                              />
                            </div>
                            <div className="my-3 overflow-x-hidden max-h-60 overflow-y-auto bg-slate-200 rounded-lg">
                              <AdminTable
                                columns={productColumnTitles}
                                data={products as IProductDetailsTable[]}
                                withCheckbox={true}
                                noHeader
                                onCheckboxChange={(products) =>
                                  handlePriceCutProductCheckbox(products, index, values.toBeDiscountedProducts)
                                }
                                getRowId={(row) => String(row.id)}
                                renderCell={getProductNameCellValue}
                                checkedRows={[
                                  ...discountValue.productIds,
                                  ...values.toBeDiscountedProducts
                                    .filter((_, i) => i !== index)
                                    .flatMap((group) => group.productIds),
                                ]}
                                disabledRows={values.toBeDiscountedProducts
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
                                      values.discountType === "PERCENTAGE"
                                        ? discountValue.discountValue
                                        : discountValue.discountValue.toLocaleString("id-ID")
                                    } ${values.discountType === "PERCENTAGE" ? "%" : "IDR"}`}</i>
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
                    {!values.isGlobalProduct && (
                      <button
                        type="button"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 gap-2 text-sm w-max font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                        onClick={() => {
                          const lastIndex = values.toBeDiscountedProducts.length - 1;
                          if (values.toBeDiscountedProducts.length > 0) {
                            if (values.toBeDiscountedProducts[lastIndex].discountValue === 0) {
                              toast.error("Please add a discount value for the last product discount!");
                              return;
                            }
                            setFieldValue("toBeDiscountedProducts", [
                              ...values.toBeDiscountedProducts,
                              { discountValue: 0, productIds: [] },
                            ]);
                          }
                        }}
                      >
                        <span>Add More Product Discounts</span>
                        <RiMenuAddLine />
                      </button>
                    )}
                  </>
                )}
                {values.discountType === "BUY1_GET1" && !values.isGlobalProduct && (
                  <>
                    <div>
                      {products
                        .filter((p) => values.selectedProducts.includes(p.id))
                        .map((p, index) => (
                          <div key={index} className="text-xs text-lime-300 col-span-2 !gap-0">
                            {index + 1} - {p.name}
                          </div>
                        ))}
                    </div>
                    <div className="w-full col-span-2 relative">
                      {!values.isGlobalProduct && showB1G1ProductDropDown && (
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
              <div>
                <ErrorMessage name="selectedProducts">
                  {(msg) => <div className="formik-error-msg">{typeof msg === 'string' ? msg : JSON.stringify(msg)}</div>}
                </ErrorMessage>
                <ErrorMessage name="selectedStores">
                  {(msg) => <div className="formik-error-msg">{typeof msg === 'string' ? msg : JSON.stringify(msg)}</div>}
                </ErrorMessage>
                <ErrorMessage name="toBeDiscountedProducts">
                  {(msg) => <div className="formik-error-msg">{typeof msg === 'string' ? msg : JSON.stringify(msg)}</div>}
                </ErrorMessage>
              </div>
              <button
                type="submit"
                className="inline-flex w-full justify-center items-center px-5 py-2.5 mt-4 sm:mt-6 text-base font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Create New Discount Promo
              </button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}
