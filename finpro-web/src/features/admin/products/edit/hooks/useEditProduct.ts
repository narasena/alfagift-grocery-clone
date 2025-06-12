import { IProductFormValues } from "@/types/products/product.type";
import { TImageItem, useEditProductImage } from "./useEditProductImage";
import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import apiInstance from "@/utils/api/apiInstance";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useEditProduct = (allImagesList: TImageItem[]) => {
  const router = useRouter();
  const { product, refreshProductDetails } = useProductDetails();
  const handleSaveChanges = async (values: Partial<IProductFormValues>, resetForm: () => void) => {
    console.log("All Images List at upload:", allImagesList);
    const editedExistingImages = allImagesList
      .filter((img) => img.type === "existing")
      .map((img) => img.data as IProductImage);

    const newUploads = allImagesList.filter((img) => img.type === "new").map((img) => img.data as ICloudinaryResult);

    try {
      const newSlug = values.name ? values.name.toLowerCase().replace(/\s+/g, "-") : product?.slug;
      const editProductResponse = await apiInstance.put(`/product/edit/${product?.slug}`, {
        ...values,
        newSlug,
        productSubCategoryId: Number(values.productSubCategoryId),
        brandId: values.brandId || null,
        description: values.description || null,
        sku: values.sku || null,
        barcode: values.barcode || null,
        weight: Number(values.weight) || null,
        dimensions: values.dimensions || null,
        editedExistingImages,
        newUploads,
      });
      console.log("Edit Product Response:", editProductResponse.data);
      toast.success("Product edited successfully!");
      resetForm();
      if (newSlug !== product?.slug) {
        router.push(`/products/edit/${editProductResponse.data.resultProduct.slug}`);
      } else {
        refreshProductDetails();
      }
    } catch (error) {
      console.error("Error editing product:", error);
      toast.error("Failed to edit product. Please try again.");
    }
  };
  return { handleSaveChanges };
};
