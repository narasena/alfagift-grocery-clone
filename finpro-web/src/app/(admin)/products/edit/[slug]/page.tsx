"use client";
import AdminPageTitle from "@/features/admin/components/AdminPageTitle";
import ProductImageUploadWidget from "@/features/admin/products/components/ProductImageUploadWidget";
import ProductInputFields from "@/features/admin/products/components/ProductInputFields";
import { useEditProductImage } from "@/features/admin/products/edit/hooks/useEditProductImage";
import { useEditProduct } from "@/features/admin/products/edit/hooks/useEditProduct";
import { formProductSchema } from "@/features/admin/products/schemas/formProductSchema";
import { IProductDetails } from "@/types/products/product.type";
import { Form, Formik } from "formik";
import { CldImage } from "next-cloudinary";
import * as React from "react";
import { MdDeleteForever } from "react-icons/md";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import * as Yup from "yup";

export interface IAppProps {}

export default function EditProductPage(props: IAppProps) {
  // const { product } = useProductDetails();
  const {
    product,
    allImagesList,
    handleImageClick,
    handleSwapImage,
    handleDeleteImage,
    handleImageUploadSuccess,
    imageShowing,
    handleSetAsMainImage,
    isThumbnailSameWithImageShowing,
  } = useEditProductImage();
  const { handleSaveChanges } = useEditProduct(allImagesList);

  return (
    <div className="">
      <div className="lg:bg-white lg:max-w-[1200px] lg:mx-auto lg:px-10 lg:py-4 px-4">
        <AdminPageTitle title="Edit Product" subTitle="Edit the form below to edit a product" />
        <Formik
          enableReinitialize={true}
          initialValues={
            {
              name: product?.name || "",
              price: product?.price || 0,
              productSubCategoryId: product?.productSubCategoryId || 0,
              brandId: product?.brandId || "",
              description: product?.description || "",
              sku: product?.sku || "",
              barcode: product?.barcode || "",
              weight: product?.weight || 0,
              dimensions: product?.dimensions || "",
              images: product?.productImage || [],
            } as Partial<IProductDetails>
          }
          validationSchema={formProductSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            console.log("Form Values:", values);
            console.log("Is Valid:", formProductSchema.isValidSync(values));
            try {
              formProductSchema.validateSync(values, { abortEarly: false });
              console.log("Validation passed!");
              handleSaveChanges(values, resetForm);
              setSubmitting(false);
            } catch (err) {
              if (err instanceof Yup.ValidationError) {
                console.log("Validation Errors:", err.errors);
              }
              setSubmitting(false);
            }
          }}
        >
          <Form className="lg: grid lg:grid-cols-[60%_1fr] w-full gap-6">
            <div className="lg:order-2 max-w-full">
              <div className="c-border lg:!px-0 flex flex-col max-lg:justify-center items-center">
                <div className="page-title border-b border-gray-300 pb-4 mb-4">
                  <span className="px-6">Product Images</span>
                </div>
                {imageShowing && (
                  <div className="size-72 border border-gray-400 rounded-md my-3 overflow-hidden">
                    <CldImage
                      width={288}
                      height={288}
                      src={"secure_url" in imageShowing ? imageShowing.secure_url : imageShowing.imageUrl}
                      alt="Selected Product Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-center">
                  {allImagesList.length > 0 && imageShowing && imageShowing.isMainImage === false && (
                    <button
                      className="my-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md"
                      onClick={() => {
                        handleSetAsMainImage();
                        console.log("clicked");
                      }}
                    >
                      Set As Main Image
                    </button>
                  )}
                  {allImagesList.length > 0 && imageShowing && imageShowing.isMainImage === true && (
                    <button className="my-4 px-4 py-2 bg-gray-700 text-white font-semibold text-xl rounded-md">
                      Main Image
                    </button>
                  )}
                </div>
                <div className="px-4 flex justify-center gap-2">
                  <div className="max-w-full flex justify-normal flex-wrap gap-4">
                    {allImagesList.map((image, index) => (
                      <div key={index} className={``}>
                        <div
                          className={`max-lg:size-18 lg:size-28 border border-gray-400 rounded-md relative group !overflow-hidden ${
                            isThumbnailSameWithImageShowing(image, imageShowing!) ? "ring-2 ring-red-600" : ""
                          }`}
                          onClick={() => handleImageClick(image.data)}
                        >
                          <CldImage
                            fill
                            sizes="(max-width: 768px) 72px, 112px"
                            src={"secure_url" in image.data ? image.data.secure_url : image.data.imageUrl}
                            alt={`Uploaded Image ${index + 1}`}
                            className="object-cover z-0"
                          />
                          {index === 0 && (
                            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1">Main</div>
                          )}
                          <div className="absolute top-0 right-0 min-w-full min-h-full bg-gray-800/20 opacity-0 group-hover:opacity-100 group-hover:z-[20]"></div>
                          <div className="absolute size-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:z-30">
                            <button
                              className="py-0.5 px-2 text-xs bg-red-700 text-white rounded-xs font-medium centered cursor-pointer"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(
                                  "public_id" in image.data ? image.data.public_id : image.data.cldPublicId || ""
                                );
                              }}
                            >
                              <span>Delete </span>
                              <MdDeleteForever />
                            </button>
                          </div>
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
                            {index < allImagesList.length - 1 && (
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
                        onSuccess={handleImageUploadSuccess}
                        maxFiles={5}
                        buttonText="Upload Images"
                        type="thumbnails"
                        uploadedImagesCount={allImagesList.length}
                      />
                    }
                  </div>
                </div>
              </div>
              <div className="px-3 w-full">
                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-2xl rounded-md "
                >
                  Update Product
                </button>
              </div>
            </div>
            <div className="lg:order-1">
              <ProductInputFields />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
