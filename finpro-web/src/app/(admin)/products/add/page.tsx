"use client";
import * as React from "react";
import { Form, Formik } from "formik";
import { formProductSchema } from "@/features/admin/products/schemas/formProductSchema";
import * as Yup from "yup";
import { CldImage } from "next-cloudinary";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import { IProductFormValues } from "@/types/products/product.type";
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
    handleCreateProduct,
  } = useCreateProduct();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPageTitle title="Add Product" subTitle="Fill the form below to add a new product" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                Product Images
              </h3>
              {imageShowing && "secure_url" in imageShowing && (
                <div className="w-full max-w-sm mx-auto aspect-square border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <CldImage
                    width={400}
                    height={400}
                    src={imageShowing.secure_url}
                    alt="Selected Product Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex justify-center mb-6">
                {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === false && (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    onClick={handleSetAsMainImage}
                  >
                    Set As Main Image
                  </button>
                )}
                {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === true && (
                  <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-md cursor-default">
                    Main Image
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div
                      className="aspect-square border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleImageClick(image)}
                    >
                      <CldImage
                        fill
                        src={image.secure_url}
                        alt={`Uploaded Image ${index + 1}`}
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">Main</div>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index - 1);
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded text-sm transition-colors"
                        >
                          <TbArrowBigLeftLinesFilled className="mx-auto" />
                        </button>
                      )}
                      {index < uploadedImages.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index + 1);
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded text-sm transition-colors"
                        >
                          <TbArrowBigRightLinesFilled className="mx-auto" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <ProductImageUploadWidget
                  onSuccess={handleImageUpload}
                  maxFiles={5}
                  buttonText="Upload Images"
                  type="thumbnails"
                  uploadedImagesCount={uploadedImages.length}
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md p-6">
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
              {() => (
                <Form>
                  <ProductInputFields />
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-md transition-colors"
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
    </div>
  );
}
