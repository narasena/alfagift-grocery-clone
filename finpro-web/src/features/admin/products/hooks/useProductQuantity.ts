import * as React from 'react';
import { useStockCheck } from '@/hooks/useStockCheck';
import { toast } from 'react-toastify';

export const useProductQuantity = (productId?: string, storeId?: string) => {
    const [quantity, setQuantity] = React.useState<number>(1);
    const { checkStock } = useStockCheck();

    const handleQuantityChange = async (action: "plus" | "minus") => {
      switch (action) {
        case "plus":
          if (productId && storeId) {
            const stockCheck = await checkStock(productId, storeId, quantity + 1);
            if (!stockCheck.isAvailable) {
              toast.error("Stok tidak mencukupi");
              return;
            }
          }
          setQuantity(quantity + 1);
          break;
        case "minus":
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
          break;
      }
    };

    return {
        quantity,
        setQuantity,
        handleQuantityChange
    }
}