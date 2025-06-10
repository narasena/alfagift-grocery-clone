import { IProductFormValues } from "@/types/products/product.type";
import { useEditProductImage } from "../components/useEditProductImage";
import { ICloudinaryResult, IProductImage } from "@/types/products/product.image.type";
import apiInstance from "@/utils/api/apiInstance";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import { toast } from "react-toastify";

export const useEditProduct = () => {
    const {product, refreshProductDetails} = useProductDetails()
    const {allImagesList} = useEditProductImage();
    const handleSaveChanges = async (values: Partial<IProductFormValues>, resetForm: () => void) => {
      const existingImages = allImagesList
        .filter((img) => img.type === "existing")
        .map((img) => img.data as IProductImage);

      const newUploads = allImagesList.filter((img) => img.type === "new").map((img) => img.data as ICloudinaryResult);

      try {
        const editProductResponse = await apiInstance.put(`/product/edit/${product?.slug}`, {
          ...values,
          productSubCategoryId: Number(values.productSubCategoryId),
          brandId: values.brandId || null,
          description: values.description || null,
          sku: values.sku || null,
          barcode: values.barcode || null,
          weight: Number(values.weight) || null,
          dimensions: values.dimensions || null,
          existingImages,
          newUploads,
        });
        console.log("Edit Product Response:", editProductResponse.data);
        toast.success("Product edited successfully!");
        resetForm();
        refreshProductDetails();
      } catch (error) {
        console.error("Error editing product:", error);
      }
  };
  return {handleSaveChanges}
}