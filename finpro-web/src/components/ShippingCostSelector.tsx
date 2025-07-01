"use client";

import { useEffect, useState } from "react";
import instance from "@/utils/axiosinstance";


interface ShippingCostOption {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
}
export default function ShippingCostSelector({ originCityId, destinationCityId }: { originCityId: string; destinationCityId: string }) {
  const [costOptions, setCostOptions] = useState<ShippingCostOption[]>([]);


  useEffect(() => {
    const fetchOngkir = async () => {
      const response = await instance.post("/shipping-cost", {
        origin: originCityId,
        destination: destinationCityId,
        weight: 1000, //1kg
        courier: "jne", 
      });

      setCostOptions(response.data);
    };

    if (originCityId && destinationCityId) fetchOngkir();
  }, [originCityId, destinationCityId]);

  return (
    <div className="space-y-2">
      {costOptions.map((option, index) => (
        <div key={index} className="p-2 border rounded">
          <p className="font-semibold">{option.service}</p>
          <p>Rp {option.cost[0].value.toLocaleString()} - Estimasi {option.cost[0].etd} hari</p>
        </div>
      ))}
    </div>
  );
}
