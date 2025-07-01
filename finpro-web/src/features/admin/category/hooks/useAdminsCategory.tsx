import * as React from "react";
import { useProductCategories } from "../../products/hooks/useProductCategories";
import * as Yup from "yup";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export interface ICategoryFormData {
  name: string;
  productCategoryId?: number;
}
export const useAdminsCategory = () => {
  const { productCategories, productSubCategories, refetch } = useProductCategories();
  const [openTabs, setOpenTabs] = React.useState<number[]>([]);

  const toggleTab = (tabId: number) => {
    setOpenTabs((prev) => (prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]));
  };

  const isTabOpen = (tabId: number) => openTabs.includes(tabId);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<ICategoryFormData>({ name: "" });
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const categorySchema = Yup.object({
    name: Yup.string().required("Category name is required").min(2, "Name must be at least 2 characters"),
    productCategoryId: isCategoryFormOpen
      ? Yup.number().required("Please select a category").min(1, "Please select a category")
      : Yup.number().notRequired(),
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ICategoryFormData) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ICategoryFormData) => ({ ...prev, [name]: Number(value) }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categorySchema.validate(formData, { abortEarly: false });
      console.log("Valid data:", formData);
      // Handle form submission here
      const response = await apiInstance.post(
        `/product-category/${isCategoryFormOpen ? "subcategories/create" : "create"}`,
        formData
      );
      console.log("Category created successfully:", response.data);
      setFormData({ name: "", productCategoryId: isCategoryFormOpen ? 0 : undefined });
      refetch(); // Refetch categories after successful creation
      toast.success(response.data.message);
    } catch (err) {
      const errorResponse = err as AxiosError<{ message: string }>;
      if (errorResponse.response?.data?.message) toast.error(errorResponse.response.data.message);
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return {
    productCategories,
    productSubCategories,
    openTabs,
    toggleTab,
    isTabOpen,
    isCategoryFormOpen,
    setIsCategoryFormOpen,
    formData,
    setFormData,
    errors,
    setErrors,
    categorySchema,
    handleInputChange,
    handleCategoryChange,
    handleSubmit,
  };
};
