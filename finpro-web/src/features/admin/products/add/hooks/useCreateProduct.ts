import { useProductCategories } from "@/hooks/products/useProductCategories";
import { IAddProductField, IProductFormValues } from "@/types/products/product.type";
import apiInstance from "@/utils/api/apiInstance";
import { useProductImagesUpload } from "./useProductImagesUpload";
import { useProductImageShowing } from "@/hooks/products/useProductImageShowing";
import { toast } from "react-toastify";

export const useCreateProduct = () => {
    const { productSubCategories } = useProductCategories()
    const { uploadedImages, setUploadedImages } = useProductImagesUpload()
    const { setImageShowing } = useProductImageShowing()
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

    const handleCreateProduct = async (values: Partial<IProductFormValues>, resetForm: () => void) => {
      try {
        const createProductResponse = await apiInstance.post("/product/create", {
          ...values,
          productSubCategoryId: Number(values.productSubCategoryId),
          brandId: values.brandId || null,
          description: values.description || null,
          sku: values.sku || null,
          barcode: values.barcode || null,
          weight: Number(values.weight) || null,
          dimensions: values.dimensions || null,
          images: uploadedImages,
        });
        console.log("Create Product Response:", createProductResponse.data);
        toast.success("Product created successfully!");
        setUploadedImages([]);
        setImageShowing(null);
        resetForm();
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("Failed to create product. Please try again.");
      }
    };
    return {
        addProductFields,
        handleCreateProduct
    }
}