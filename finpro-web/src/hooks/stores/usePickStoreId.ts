import * as React from "react";
import storeLocationStore from "@/zustand/storeLocation.store";
import { useAllStores } from "./useAllStores";

export default function usePickStoreId() {
    const { stores } = useAllStores();
    const setLocationStore = storeLocationStore((state) => state.setStoreLocation);
    const localStorageStoreId = storeLocationStore((state) => state.storeId);
    
    const [storeId, setStoreId] = React.useState(localStorageStoreId);
    const [miniButton, setMiniButton] = React.useState(true);
    const [dropdown, setDropdown] = React.useState(false);
    const hasInitialized = React.useRef(false);

    const handleInitialLocationStore = () => {
        if(!localStorageStoreId) {
            setLocationStore({ _latitude: null, _longitude: null, _storeId: "cmbrpl9tp0002p1oo9ca2exgc" });
        } else {
            setStoreId(localStorageStoreId);
        }
        console.log(localStorageStoreId);
    }

    React.useEffect(() => {
        if (!hasInitialized.current) {
            handleInitialLocationStore();
            hasInitialized.current = true;
        }
    }, [localStorageStoreId]);
    
    return {
        stores,
        storeId,
        setStoreId,
        setLocationStore,
        miniButton,
        setMiniButton,
        dropdown,
        setDropdown
    }
}