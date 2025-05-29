import * as React from 'react';
import { toast } from 'react-toastify';

export default function AdminProductListViewPage() {
    const [products, setProducts] = React.useState([]);

    const handleGetProducts = async () => {
        try {
            const response = 
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products. Please try again later.');
        }
    }
  return (
    <div>
      
    </div>
  );
}
