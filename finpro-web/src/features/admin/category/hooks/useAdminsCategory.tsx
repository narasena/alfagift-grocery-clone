import * as React from "react";
import { useProductCategories } from "../../products/hooks/useProductCategories";
import { ICategoryFormData } from "@/app/(admin)/category/page";
import * as Yup from "yup";

export const useAdminsCategory = () => {
    const { productCategories, productSubCategories } = useProductCategories()
    const [openTabs, setOpenTabs] = React.useState<number[]>([]);
    
    const toggleTab = (tabId: number) => {
        setOpenTabs(prev => 
            prev.includes(tabId) 
                ? prev.filter(id => id !== tabId)
                : [...prev, tabId]
        );
    };
    
    const isTabOpen = (tabId: number) => openTabs.includes(tabId);
    const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState<boolean>(false);
      const [formData, setFormData] = React.useState<ICategoryFormData>({ name: "" });
      const [errors, setErrors] = React.useState<{ name?: string; categoryId?: string }>({});
        
        const categorySchema = Yup.object({
            name: Yup.string().required("Category name is required").min(2, "Name must be at least 2 characters"),
            categoryId: isCategoryFormOpen 
                ? Yup.number().required("Please select a category").min(1,"Please select a category")
                : Yup.number().notRequired()
        });
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
      };
    
        const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    
            // Clear error when user starts typing
            if (errors[name as keyof typeof errors]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
            if (errors) { }
        };

  return { productCategories, productSubCategories, openTabs, toggleTab, isTabOpen, isCategoryFormOpen, setIsCategoryFormOpen, formData, setFormData, errors, setErrors, categorySchema, handleInputChange, handleCategoryChange };
};