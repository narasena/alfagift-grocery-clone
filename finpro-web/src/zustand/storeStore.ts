import { create } from "zustand";

interface Store {
  id: string;
  name: string;
  city: string;
  distance?: number;
}

interface StoreState {
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
}

const useStoreStore = create<StoreState>((set) => ({
  selectedStore: null,
  setSelectedStore: (store) => {
    localStorage.setItem("selectedStore", JSON.stringify(store));
    set({ selectedStore: store });
  },
}));

export default useStoreStore;
