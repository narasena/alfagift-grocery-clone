"use client";
import * as React from "react";
import { Form, Formik } from "formik";
import { formProductSchema } from "@/features/admin/products/schemas/formProductSchema";
import * as Yup from "yup";
import { CldImage } from "next-cloudinary";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import { IProductFormValues } from "@/types/products/product.type";
import { useProductImagesUpload } from "@/features/admin/products/add/hooks/useProductImagesUpload";
import { useCreateProduct } from "@/features/admin/products/add/hooks/useCreateProduct";
import ProductInputFields from "@/features/admin/products/components/ProductInputFields";
import ProductImageUploadWidget from "@/features/admin/products/components/ProductImageUploadWidget";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";

export default function AddProductPage() {
  const {
    imageShowing,
    handleImageClick,
    uploadedImages,
    handleSwapImage,
    handleSetAsMainImage,
    handleImageUpload,
    handleDeleteImage,
    handleCreateProduct,
  } = useCreateProduct();

  return (
    <div className="bg-red-400">
      <div className="lg:bg-white lg:max-w-[1200px] lg:mx-auto lg:px-10 lg:py-4 px-4">
        <AdminPageTitle title="Add Product" subTitle="Fill the form below to add a new product" />
        <div className="lg: grid lg:grid-cols-[60%_1fr] w-full gap-6">
          <div className="lg:order-2 lg:!px-0 max-w-full flex flex-col max-lg:justify-center items-center c-border">
            <div className="page-title border-b border-gray-300 pb-4 mb-4">
              <span className="px-6">Product Images</span>
            </div>
            {imageShowing && "secure_url" in imageShowing && (
              <div className="size-72 border border-gray-400 rounded-md my-3">
                <CldImage
                  width={288}
                  height={288}
                  src={imageShowing.secure_url}
                  alt="Selected Product Image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
            <div className="px-4 flex justify-center gap-2">
              <div className="max-w-full flex justify-normal flex-wrap gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div
                      className="max-lg:size-18 lg:size-28 border border-gray-400 rounded-md relative !overflow-hidden"
                      onClick={() => handleImageClick(image)}
                    >
                      <CldImage
                        fill
                        src={image.secure_url}
                        alt={`Uploaded Image ${index + 1}`}
                        className="object-cover"
                      />
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
                {
                  <ProductImageUploadWidget
                    onSuccess={handleImageUpload}
                    maxFiles={5}
                    buttonText="Upload Images"
                    type="thumbnails"
                    uploadedImagesCount={uploadedImages.length}
                  />
                }
              </div>
            </div>
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
              validationSchema={formProductSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("Form Values:", values);
                console.log("Is Valid:", formProductSchema.isValidSync(values));
                try {
                  formProductSchema.validateSync(values, { abortEarly: false });
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
              {({ resetForm }) => (
                <Form>
                  <ProductInputFields resetForm={resetForm} />
                  <div className="px-3 w-full">
                    <button
                      type="submit"
                      className="w-full mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-2xl rounded-md "
                    >
                      Add Product
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
