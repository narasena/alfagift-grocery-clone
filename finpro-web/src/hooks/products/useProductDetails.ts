
import { getProductDetails } from '@/services/getProductDetails';
import { IProductDetails } from '@/types/products/product.type';
import { useParams } from 'next/navigation';
import * as React from 'react'
import { useProductImageShowing } from './useProductImageShowing';

export const useProductDetails = () => {
    const params = useParams()
    const {imageShowing, setImageShowing, handleImageClick} = useProductImageShowing()
    const [product, setProduct] = React.useState<IProductDetails | null>(null);

    const handleGetProductDetails = async () => {
        try {
            const productData = await getProductDetails(params.slug as string);
            setProduct(productData!);
            setImageShowing(productData?.productImage.find((image) => image.isMainImage === true) || null);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    React.useEffect(() => {
        handleGetProductDetails();
    }, []);
    return {
        product,
        imageShowing,
        handleImageClick
    }
}