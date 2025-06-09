import { useProductCategories } from "@/hooks/products/useProductCategories";
import { IAddProductField } from "@/types/products/product.type";
import { ErrorMessage, Field } from "formik";
import * as React from "react";

export interface IProductFieldsGroup {
  group: TGroupedProductFields;
  title: string;
  fields: string[];
}

type TGroupedProductFields = "basic" | "category" | "details" | "price" | "inventory" | "physical" | "others";

export default function ProductInputFields() {
  const { productCategories, productSubCategories } = useProductCategories();
  const addProductFields: IAddProductField[] = [
    { name: "name", title: "Product Name", type: "text" },
    { name: "description", title: "Product Description", type: "textarea" },
    { name: "productSubCategoryId", title: "Product Sub Category", type: "select", options: productSubCategories },
    { name: "brandId", title: "Brand", type: "select", options: [] },
    { name: "price", title: "Product Price", type: "number" },
    { name: "sku", title: "SKU", type: "text" },
    { name: "barcode", title: "Barcode", type: "text" },
    { name: "weight", title: "Weight", type: "number" },
    { name: "dimensions", title: "Dimensions", type: "text" }
  ];

  const productFieldGroups: IProductFieldsGroup[] = [
    { group: "basic", title: "Name & Description", fields: ["name", "description"] },
    { group: "category", title: "Category", fields: ["productSubCategoryId"] },
    { group: "details", title: "Product Details", fields: ["brandId"] },
    { group: "price", title: "Price", fields: ["price"] },
    { group: "inventory", title: "Inventory", fields: ["sku", "barcode"] },
    { group: "physical", title: "Physical", fields: ["weight", "dimensions"] },
    { group: "others", title: "Others", fields: [] },
  ];

  return (
    <div>
      {productFieldGroups.map(
        (group, index) =>
          group.fields.length > 0 && (
            <div key={index} className="c-border-web !px-0">
              <div className="page-title border-b border-gray-300 pb-4 mb-4">
                <span className="px-6">{group.title}</span>
              </div>
              {addProductFields
                .filter((field) => group.fields.includes(field.name))
                .map((field, indx) => (
                  <div
                    key={indx}
                    className={
                      "text-gray-600 px-6 w-full " +
                      (indx > 4 ? "grid grid-cols-[30%_1fr] gap-x-4 items-center my-2" : "")
                    }
                  >
                    <label htmlFor={field.name} className="block mb-2 text-base font-medium">
                      {field.title}
                    </label>
                    {field.type === "select" && field.options ? (
                      <Field
                        name={field.name}
                        id={field.name}
                        as="select"
                        className="w-full bg-white border border-gray-300 rounded-md p-2"
                      >
                        {field.name === "productSubCategoryId" ? (
                          <>
                            <option value={0}>Select Sub Category</option>
                            {productCategories.map((category) => (
                              <optgroup key={category.id} label={category.name}>
                                {productSubCategories
                                  .filter((subCategory) => subCategory.productCategoryId === category.id)
                                  .map((subCategory) => (
                                    <option key={subCategory.id} value={Number(subCategory.id)}>
                                      {subCategory.name}
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                          </>
                        ) : (
                          <>
                            <option value="">Select Brand</option>
                            {field.options?.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </>
                        )}
                      </Field>
                    ) : (
                      <Field
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        className="w-full bg-white border border-gray-300 rounded-md p-2"
                      />
                    )}
                    <ErrorMessage name={field.name} component="div" className="text-sm text-red-600" />
                  </div>
                ))}
            </div>
          )
      )}
    </div>
  );
}
