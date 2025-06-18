import { IProductDetails } from '@/types/products/product.type';
import apiInstance from '@/utils/api/apiInstance';
import * as React from 'react';
import { toast } from 'react-toastify';

export const useAllProducts = () => {
    const [products, setProducts] = React.useState<IProductDetails[]>([]);

    const handleGetProducts = async () => {
        try {
          const response = await apiInstance.get("/product/all");
          setProducts(response.data.products);
          console.log(`Products: `, response.data.products);
          toast.success(response.data.message);
        } catch (error) {
          console.error(`Error fetching products: `, error);
          toast.error(`Failed to fetch products. Please try again later.`);
        }
    };
    
    React.useEffect(() => {
        handleGetProducts();
      }, []);

    return {
        products,
        setProducts
    };
}