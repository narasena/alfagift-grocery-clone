import * as React from "react";
import { IStore } from "@/types/stores/store.type";
import apiInstance from "@/utils/api/apiInstance";
import { toast } from "react-toastify";

export const useAllStores = () => {
    const [stores, setStores] = React.useState<IStore[]>([]);

    const handleGetAllStores = async () => {
        try {
            const response = await apiInstance.get("/stores/all");
            setStores(response.data.stores);
            console.log(`Stores: `, response.data.stores);
            toast.success(response.data.message);
        } catch (error) {
            console.error(`Error fetching stores: `, error);
            toast.error(`Failed to fetch stores. Please try again later.`);
        }
    };

    React.useEffect(() => {
        handleGetAllStores();
    }, []);

    return {
        stores,
        setStores
    };
}