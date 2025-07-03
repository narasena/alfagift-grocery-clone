import { useProductCategories } from "@/features/admin/products/hooks/useProductCategories";
import { IAddProductField } from "@/types/products/product.type";
import { ErrorMessage, Field } from "formik";
import * as React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export interface IProductFieldsGroup {
  group: TGroupedProductFields;
  title: string;
  fields: string[];
}

type TGroupedProductFields = "basic" | "category" | "details" | "price" | "inventory" | "physical" | "others";

export default function ProductInputFields() {
  const { productCategories, productSubCategories } = useProductCategories();
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    details: false,
    inventory: false,
    physical: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const addProductFields: IAddProductField[] = [
    { name: "name", title: "Product Name", type: "text" },
    { name: "description", title: "Product Description", type: "textarea" },
    { name: "productSubCategoryId", title: "Product Sub Category", type: "select", options: productSubCategories },
    { name: "brandId", title: "Brand", type: "select", options: [] },
    { name: "price", title: "Product Price", type: "number" },
    { name: "sku", title: "SKU", type: "text" },
    { name: "barcode", title: "Barcode", type: "text" },
    { name: "weight", title: "Weight", type: "number" },
    { name: "dimensions", title: "Dimensions", type: "text" },
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
            <div key={index} className="mb-6">
              {/* Collapsible sections */}
              {['details', 'inventory', 'physical'].includes(group.group) ? (
                <div className="border border-gray-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => toggleSection(group.group)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{group.title} (Optional)</span>
                    {expandedSections[group.group] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSections[group.group] && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                      {addProductFields
                        .filter((field) => group.fields.includes(field.name))
                        .map((field, indx) => (
                          <div key={indx} className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                              {field.title}
                            </label>
                            {field.type === "select" && field.options ? (
                              <Field
                                name={field.name}
                                id={field.name}
                                as="select"
                                className="w-full bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Brand</option>
                                {field.options?.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                              </Field>
                            ) : (
                              <Field
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                className="w-full bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            )}
                            <ErrorMessage name={field.name} component="div" className="text-sm text-red-600" />
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular sections */
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    {group.title}
                  </h3>
                  {addProductFields
                    .filter((field) => group.fields.includes(field.name))
                    .map((field, indx) => (
                      <div key={indx} className="space-y-2">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                          {field.title}
                        </label>
                        {field.type === "select" && field.options ? (
                          <Field
                            name={field.name}
                            id={field.name}
                            as="select"
                            className="w-full bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
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
                          </Field>
                        ) : field.type === "textarea" ? (
                          <Field
                            as="textarea"
                            name={field.name}
                            id={field.name}
                            rows={3}
                            className="w-full bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <Field
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            className="w-full bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                        <ErrorMessage name={field.name} component="div" className="text-sm text-red-600" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
}
