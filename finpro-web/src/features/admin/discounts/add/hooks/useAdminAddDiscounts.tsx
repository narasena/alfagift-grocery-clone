import * as React from "react";
import { EDiscountType, IAddDiscountForm } from "@/types/discounts/discount.type";
import { useAllStores } from "@/features/admin/products/hooks/stores/useAllStores";
import { useAllProducts } from "@/features/admin/products/hooks/useAllProducts";
import { IStore } from "@/types/stores/store.type";
import { IProductDetails } from "@/types/products/product.type";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";

export const useAdminAddDiscounts = (setFieldValue?: (field: string, value: any) => void) => {
  const discountTypes = Object.keys(EDiscountType);
  const { stores } = useAllStores();
  const { products } = useAllProducts();
  const [showStoreDropDown, setStoreShowDropDown] = React.useState<boolean>(false);
  const [showB1G1ProductDropDown, setB1G1ProductShowDropDown] = React.useState<boolean>(false);

  const addDiscountInitialValues: IAddDiscountForm = {
    name: "",
    description: "",
    discountType: "",
    discountValue: 0,
    minPurchaseValue: 0,
    startDate: "",
    endDate: "",
    isGlobalProduct: true,
    isGlobalStore: true,
    usageLimitPerTransaction: 0,
    selectedProducts: [],
    selectedStores: [],
    toBeDiscountedProducts: [],
  };

  const storeColumnTitles = [{ key: "name", label: "Store Name" }];
  const productColumnTitles = [{ key: "name", label: "Product Name" }];
  const getStoreNameCellValue = (row: IStore, key: string) => {
    return row.name || "—";
  };

  const getProductNameCellValue = (row: IProductDetails, key: string) => {
    return row.name || "—";
  };

  const handlePriceCutProductCheckbox = (
    newSelectedProducts: string[],
    discountIndex: number,
    currentProducts: any[]
  ) => {
    const updated = [...currentProducts];
    const currentGroup = updated[discountIndex];

    if (currentGroup) {
      // Get products already selected in other discount groups
      const otherGroupProducts = updated.filter((_, i) => i !== discountIndex).flatMap((group) => group.productIds);

      // Only allow products that aren't in other groups or are currently in this group
      const validProducts = newSelectedProducts.filter(
        (productId) => !otherGroupProducts.includes(productId) || currentGroup.productIds.includes(productId)
      );

      updated[discountIndex].productIds = validProducts;
    }

    // Update Formik state
    if (setFieldValue) {
      setFieldValue("toBeDiscountedProducts", updated);
    }

    return updated;
  };

  const handleProductCheckBox = (newSelectedProducts: string[]) => {
    if (setFieldValue) {
      setFieldValue("selectedProducts", newSelectedProducts);
    }
  };

  const handleStoreCheckbox = (newSelectedStores: string[]) => {
    if (setFieldValue) {
      setFieldValue("selectedStores", newSelectedStores);
    }
  };

  const handleStoreDropDown = () => {
    setStoreShowDropDown(!showStoreDropDown);
  };
  const handleB1G1ProductDropDown = () => {
    setB1G1ProductShowDropDown(!showB1G1ProductDropDown);
  };

  const handleCreateDiscount = async (values: IAddDiscountForm) => {
    try {
      const response = await apiInstance.post("/discounts/create", values);
      console.log(response.data.discount)
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to create discount. Please try again.");
      console.error("Error creating discount:", error);
    }
  };

  return {
    stores,
    products,
    discountTypes,
    storeColumnTitles,
    productColumnTitles,
    getStoreNameCellValue,
    getProductNameCellValue,
    handlePriceCutProductCheckbox,
    handleStoreCheckbox,
    showStoreDropDown,
    handleStoreDropDown,
    handleProductCheckBox,
    showB1G1ProductDropDown,
    handleB1G1ProductDropDown,
    addDiscountInitialValues,
    handleCreateDiscount
  };
};
