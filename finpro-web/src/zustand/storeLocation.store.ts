import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IStoreLocationState {
  latitude: string | null;
  longitude: string | null;
  storeId: string | null;
  setStoreLocation: ({ _latitude, _longitude, _storeId }: IStoreLocationStore) => void;
}

interface IStoreLocationStore {
  _latitude: string | null;
  _longitude: string | null;
  _storeId: string | null;
}

const storeLocationStore = create<IStoreLocationState>()(
    persist(
        (set) => ({
            latitude: null,
            longitude: null,
            storeId: null,
            setStoreLocation: ({ _latitude, _longitude, _storeId }: IStoreLocationStore) => {
                return set({ latitude: _latitude, longitude: _longitude, storeId: _storeId })
            },
        }),
        {
            name: "storeLocation",
            partialize: (state: IStoreLocationState) => ({ storeId: state.storeId }),
        }
    )
)

export default storeLocationStore;