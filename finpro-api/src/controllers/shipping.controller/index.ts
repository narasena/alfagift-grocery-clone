import { Request, Response } from "express";
import { calculateCost } from "@/utils/raja.ongkir";
import axios from "axios";


export const getShippingCost = async (req: Request, res: Response) => {
  const { origin, destination, weight, courier } = req.body;

  if (!origin || !destination || !weight || !courier) {
    res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const costs = await calculateCost({
      origin,
      destination,
      weight: parseInt(weight),
      courier,
    });
    res.json(costs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get shipping cost" });
  }
};

export const getCityIdByName = async (req: Request, res: Response) => {
  const cityName = req.query.name as string;

  if (!cityName) {
    res.status(400).json({ message: "Nama kota harus disertakan" });
  }

  try {
    const response = await axios.get("https://api.rajaongkir.com/starter/city", {
      headers: { key: process.env.RAJAONGKIR_API_KEY! },
    });

    const matched = response.data.rajaongkir.results.find((city: any) =>
      city.city_name.toLowerCase().includes(cityName.toLowerCase()),
    );

    if (!matched) res.status(404).json({ message: "Kota tidak ditemukan" });

    res.json({ city_id: matched.city_id });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil city_id", error });
  }
};
