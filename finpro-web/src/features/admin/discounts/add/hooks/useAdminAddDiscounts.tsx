import * as React from "react";
import { EDiscountType, TDiscountType } from "@/types/discounts/discount.type";
import { useAllStores } from "@/features/admin/products/hooks/stores/useAllStores";
import { useAllProducts } from "@/features/admin/products/hooks/useAllProducts";
import { IStore } from "@/types/stores/store.type";
import { IProductDetails } from "@/types/products/product.type";

interface IPriceCutSelectedProduct {
  discountValue: number;
  productIds: string[];
}

export const useAdminAddDiscounts = () => {
  const discountTypes = Object.keys(EDiscountType);
  const { stores } = useAllStores();
  const { products } = useAllProducts();
  const [discountType, setDiscountType] = React.useState<TDiscountType | "">("");
  const [isChooseStores, setIsChooseStores] = React.useState<boolean>(false);
  const [isChooseProducts, setIsChooseProducts] = React.useState<boolean>(false);
  const [selectedStores, setSelectedStores] = React.useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
    const [toBeDiscountedProducts, setToBeDiscountedProducts] = React.useState<IPriceCutSelectedProduct[]>([]);
    const [showStoreDropDown, setStoreShowDropDown] = React.useState<boolean>(false);
    const [showB1G1ProductDropDown, setB1G1ProductShowDropDown] = React.useState<boolean>(false);

  const storeColumnTitles = [{ key: "name", label: "Store Name" }];
  const productColumnTitles = [{ key: "name", label: "Product Name" }];
  const getStoreNameCellValue = (row: IStore, key: string) => {
    return row.name || "—";
  };

  const getProductNameCellValue = (row: IProductDetails, key: string) => {
    return row.name || "—";
  };

  const handleDiscountValueChange = (productId: string, value: number) => {
    setToBeDiscountedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.productIds.includes(productId));

      if (existingIndex >= 0) {
        // Update existing product discount
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          discountValue: value,
        };
        return updated;
      } else {
        // Create new product discount
        return [
          ...prev,
          {
            productIds: [productId],
            discountValue: value,
          },
        ];
      }
    });
  };
  const handlePriceCutProductCheckbox = (newSelectedProducts: string[], discountIndex: number) => {
    setToBeDiscountedProducts((prev) => {
      const updated = [...prev];
      const currentGroup = updated[discountIndex];
      
      if (currentGroup) {
        // Get products already selected in other discount groups
        const otherGroupProducts = updated
          .filter((_, i) => i !== discountIndex)
          .flatMap(group => group.productIds);
        
        // Only allow products that aren't in other groups or are currently in this group
        const validProducts = newSelectedProducts.filter(productId => 
          !otherGroupProducts.includes(productId) || currentGroup.productIds.includes(productId)
        );
        
        updated[discountIndex].productIds = validProducts;
      }
      return updated;
    });
    };
    
    const handleProductCheckBox = (newSelectedProducts: string[]) => {
      setSelectedProducts(newSelectedProducts);
    }

  const handleStoreCheckbox = (newSelectedStores: string[]) => {
    setSelectedStores(newSelectedStores);
    };
    
    const handleStoreDropDown = () => {
      setStoreShowDropDown(!showStoreDropDown);
    };
    const handleB1G1ProductDropDown = () => {
      setB1G1ProductShowDropDown(!showB1G1ProductDropDown);
    }

  return {
    stores,
    products,
    discountTypes,
    discountType,
    setDiscountType,
    isChooseStores,
    setIsChooseStores,
    isChooseProducts,
    setIsChooseProducts,
    selectedStores,
    setSelectedStores,
    selectedProducts,
    setSelectedProducts,
    storeColumnTitles,
    productColumnTitles,
    getStoreNameCellValue,
    getProductNameCellValue,
    toBeDiscountedProducts,
    setToBeDiscountedProducts,
    handlePriceCutProductCheckbox,
    handleStoreCheckbox,
    showStoreDropDown,
    handleStoreDropDown,
      handleProductCheckBox,
    showB1G1ProductDropDown,
    handleB1G1ProductDropDown
  };
};
