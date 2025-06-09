"use client";
import * as React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { addProductSchemas } from "@/features/schemas/addProductSchemas";
import * as Yup from "yup";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import { IProductFormValues } from "@/types/products/product.type";
import { useProductCategories } from "@/hooks/products/useProductCategories";
import { useProductImagesUpload } from "@/features/admin/products/add/hooks/useProductImagesUpload";
import { useCreateProduct } from "@/features/admin/products/add/hooks/useCreateProduct";
import ProductImageUploadButton from "@/features/admin/products/components/ProductImageUploadButton";
import ProductInputFields from "@/features/admin/products/components/ProductInputFields";

export default function AddProductPage() {
  const { productCategories, productSubCategories } = useProductCategories();
  const { imageShowing, handleImageClick, uploadedImages, handleSwapImage, handleSetAsMainImage, handleImageUpload } =
    useProductImagesUpload();
  const { addProductFields, handleCreateProduct } = useCreateProduct();

  return (
    <div className="bg-red-400">
      <div className="lg:bg-white lg:max-w-[1200px] lg:mx-auto lg:px-10 lg:py-4 px-4">
        <div className="c-border-web lg:w-full lg:px-6 lg:py-4">
          <span className="page-title">Add New Product</span>
          <p className="page-subtitle">Fill the form below to add a new product</p>
        </div>
        <div className="lg: grid lg:grid-cols-[60%_40%] lg:gap-6">
          <div className="lg:order-2 px-3 w-full flex flex-col max-lg:justify-center items-center c-border">
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
            <ProductImageUploadButton
              uploadePreset="products-image"
              onSuccess={handleImageUpload}
              maxFiles={5}
              buttonText="Upload Images"
            />
          </div>
          <div className="lg:order-1">
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
                <ProductInputFields />
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
        </div>
      </div>
    </div>
  );
}
