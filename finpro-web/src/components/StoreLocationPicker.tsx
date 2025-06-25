"use client";
import { useAllStores } from "@/hooks/stores/useAllStores";
import storeLocationStore from "@/zustand/storeLocation.store";
import * as React from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";

export default function StoreLocationPicker() {
  const { stores } = useAllStores();
  const setLocationStore = storeLocationStore((state) => state.setStoreLocation);
  const currentStoreId = storeLocationStore((state) => state.storeId);
  const handleInitialLocationStore = () => {
    if (!currentStoreId) {
      setLocationStore({ _latitude: null, _longitude: null, _storeId: "cmbrpl9tp0002p1oo9ca2exgc" });
    }
  };
  const [miniButton, setMiniButton] = React.useState(true);
  const [dropdown, setDropdown] = React.useState(false);

  React.useEffect(() => {
    if (stores.length > 0) {
      handleInitialLocationStore();
    }
  }, [stores]);

  return (
    <div
      className={`fixed top-0 left-0 m-4 z-50 hover:opacity-100 ${
        miniButton && "opacity-50 transition duration-300 ease-in-out"
      }`}
      onMouseLeave={() =>
        setTimeout(() => {
          setMiniButton(true);
          setDropdown(false);
        }, 1250)
      }
    >
      {miniButton && (
        <button
          className="shadow-gray-800 shadow-md bg-blue-800 text-white text-3xl p-4 rounded-full hover:bg-white hover:text-blue-700 hover:ring-6 hover:ring-blue-600 hover:shadow-2xl hover:cursor-pointer"
          onClick={() => setMiniButton(false)}
        >
          <IoStorefront />
        </button>
      )}
      {!miniButton && (
        <div className="flex flex-col gap-2">
          <div className="text-xs py-1.5 px-2.5 bg-blue-800 text-white rounded-md w-max">
            <div>{`Current Store: `}</div>
            <b className="text-sm">{stores.find((store) => store.id === currentStoreId)?.name}</b>
          </div>
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="shadow-gray-800 shadow-md w-max text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-900 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
            type="button"
            onClick={() => setDropdown(!dropdown)}
          >
            {`Select Stores `}
            <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}
      {dropdown && (
        <div
          id="dropdown"
          className="z-10 mt-3 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-max dark:bg-gray-700"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 w-max">
            {stores.map((store, index) => (
              <li
                key={index}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  // setMiniButton(true);
                  // setDropdown(false);
                  setLocationStore({ _latitude: null, _longitude: null, _storeId: store.id });
                }}
              >
                {store.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
