import { useState, useCallback } from 'react';
import apiInstance from '@/utils/api/apiInstance';

export const useStockCheck = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkStock = useCallback(async (productId: string, storeId: string, quantity: number) => {
    setIsChecking(true);
    try {
      const response = await apiInstance.post('/inventories/check-stock', {
        productId,
        storeId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Stock check failed:', error);
      return { success: false, isAvailable: false };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkStock, isChecking };
};