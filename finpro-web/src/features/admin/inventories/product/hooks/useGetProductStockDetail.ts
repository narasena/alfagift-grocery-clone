import * as React from "react"
import { useParams } from "next/navigation"
import { IProductStock } from "@/types/inventories/product.stock.type"
import apiInstance from "@/utils/api/apiInstance"
import { toast } from "react-toastify"

export const useGetProductStockDetail = () => {
    const params = useParams()
    const slug = params.slug
    const storeId = params.storeId

    const [productStockDetail, setProductStockDetail] = React.useState<IProductStock | null>(null);

    const handleGetProductStockDetail = async () => {
        try {
            const productStockDetailResponse = await apiInstance.get(`inventories/product/${slug}/${storeId}`);
            setProductStockDetail(productStockDetailResponse.data.productStockDetail);
            toast.success(productStockDetailResponse.data.message);
        } catch (error) {
            console.error(error);
            toast.error("Failed to get product stock detail");
        }
    };

    React.useEffect(() => {
        handleGetProductStockDetail();
    }, []);

    return {productStockDetail}
}