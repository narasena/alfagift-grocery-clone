"use client";
import * as React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { addProductSchemas } from "@/features/schemas/addProductSchemas";
import * as Yup from "yup";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import { IAddProductField, IProductFormValues } from "@/types/products/product.type";
import { useProductCategories } from "@/hooks/products/useProductCategories";
import { useProductImagesUpload } from "@/features/(admin)/products/add/hooks/useProductImagesUpload";


export default function AddProductPage() {
  const { productCategories, productSubCategories } = useProductCategories();
  const {
    imageShowing,
    handleImageClick,
    uploadedImages,
    handleSwapImage,
    handleSetAsMainImage,
    handleImageUpload,
    handleCreateProduct,
  } = useProductImagesUpload();

  const addProductFields: IAddProductField[] = [
    { name: "name", title: "Product Name", type: "text" },
    { name: "price", title: "Product Price", type: "number" },
    { name: "productSubCategoryId", title: "Product Sub Category", type: "select", options: productSubCategories },
    { name: "brandId", title: "Brand", type: "select", options: [] },
    { name: "description", title: "Product Description", type: "text" },
    { name: "sku", title: "SKU", type: "text" },
    { name: "barcode", title: "Barcode", type: "text" },
    { name: "weight", title: "Weight", type: "number" },
    { name: "dimensions", title: "Dimensions", type: "text" }, // This should be populated with categories
  ];

  return (
    <div className="text-black">
      <div>
        <span className="text-2xl font-bold w-full px-4 py-3">Add New Product</span>
      </div>
      <Formik
        initialValues={
          {
            name: "",
            price: 0,
            productSubCategoryId: 0,
            brandId: "",
            description: "",
            sku: "",
            barcode: "",
            weight: 0,
            dimensions: "",
            images: [],
          } as Partial<IProductFormValues>
        }
        validationSchema={addProductSchemas}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log("Form Values:", values);
          console.log("Is Valid:", addProductSchemas.isValidSync(values));
          try {
            addProductSchemas.validateSync(values, { abortEarly: false });
            console.log("Validation passed!");
            handleCreateProduct(values, resetForm);
            setSubmitting(false);
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              console.log("Validation Errors:", err.errors);
            }
            setSubmitting(false);
          }
        }}
      >
        <Form>
          <div className="px-3 w-full flex flex-col justify-center items-center">
            <label className="text-gray-700 w-full block mb-2 text-xl font-medium">Product Images:</label>
            <div className="size-72 border border-gray-400 rounded-md my-3">
              {imageShowing && "secure_url" in imageShowing && (
                <CldImage
                  width={288}
                  height={288}
                  src={imageShowing.secure_url}
                  alt="Selected Product Image"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex justify-center">
              {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === false && (
                <button
                  className="my-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md"
                  onClick={handleSetAsMainImage}
                >
                  Set As Main Image
                </button>
              )}
              {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === true && (
                <button className="my-4 px-4 py-2 bg-gray-700 text-white font-semibold text-xl rounded-md">
                  Main Image
                </button>
              )}
            </div>
            <div className="flex justify-center gap-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <div
                    className="size-18 border border-gray-400 overflow-hidden"
                    onClick={() => handleImageClick(image)}
                  >
                    <CldImage width={72} height={72} src={image.secure_url} alt={`Uploaded Image ${index + 1}`} />
                    {index === 0 && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1">Main</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="col-start-1 flex-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index - 1);
                          }}
                          className="bg-gray-700 text-gray-200 w-full flex items-center justify-center text-2xl rounded-sm"
                        >
                          <TbArrowBigLeftLinesFilled />
                        </button>
                      )}
                    </div>
                    <div className="col-start-2 flex-1">
                      {index < uploadedImages.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index + 1);
                          }}
                          className="bg-gray-200 text-gray-700 w-full flex items-center justify-center text-2xl rounded-sm"
                        >
                          <TbArrowBigRightLinesFilled />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CldUploadWidget
              uploadPreset="products-image"
              signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/signed-upload`}
              onSuccess={handleImageUpload}
              options={{
                sources: ["local", "url", "camera"],
                multiple: true,
                maxFiles: 5,
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md"
                  onClick={() => open?.()}
                >
                  Upload Images
                </button>
              )}
            </CldUploadWidget>
          </div>
          <div>
            {addProductFields.map((field, index) => (
              <div
                key={index}
                className={
                  "text-gray-700 px-2 w-full " + (index > 4 ? "grid grid-cols-[30%_1fr] gap-x-4 items-center my-2" : "")
                }
              >
                <label htmlFor={field.name} className="block mb-2 text-xl font-medium">
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
          <div className="px-3 w-full">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-2xl rounded-md "
            >
              Add Product
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
