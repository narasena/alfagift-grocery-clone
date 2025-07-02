"use client";

import { useEffect, useState } from "react";
import instance from "../utils/axiosinstance";

interface UserAddress {
  id: string;
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  isMainAddress: boolean;
}

interface CheckoutShippingAddressProps {
  userId: string;
  onSelect: (address: UserAddress, rajaOngkirCityId: string) => void;
}

export default function CheckoutShippingAddress({ userId, onSelect }: CheckoutShippingAddressProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selected, setSelected] = useState<string>("");

  const fetchRajaOngkirCityId = async (cityName: string) => {
    const res = await instance.get("/api/rajaongkir/city-id?name=" + cityName);
    return res.data.city_id;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get(`/user-address/${userId}`);
      setAddresses(res.data);
      const main = res.data.find((a: UserAddress) => a.isMainAddress);
      if (main) {
        setSelected(main.id);
        const cityId = await fetchRajaOngkirCityId(main.city);
        onSelect(main, cityId);
      }
    };
    fetchData();
  }, []);

  const handleSelect = async (id: string) => {
    setSelected(id);
    const selectedAddress = addresses.find((a) => a.id === id);
    if (selectedAddress) {
      const cityId = await fetchRajaOngkirCityId(selectedAddress.city);
      onSelect(selectedAddress, cityId);
    }
  };

  return (
    <div>
      {addresses.length === 0 ? (
        <p>Silakan tambahkan alamat pengiriman terlebih dahulu.</p>
      ) : (
        addresses.map((a) => (
          <div key={a.id}>
            <input
              type="radio"
              checked={selected === a.id}
              onChange={() => handleSelect(a.id)}
            />
            <span>{a.address}, {a.city}</span>
          </div>
        ))
      )}
    </div>
  );
}
