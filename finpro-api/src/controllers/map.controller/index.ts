import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const getMapHandler = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Query 'q' is required" });
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q,
          format: "json",
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          "User-Agent":
            "FinproGroceryApp/1.0 (jessechristianmambu.12@gmail.com)",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Geocode Error:", error);
    res.status(500).json({ error: "Gagal mengambil data lokasi" });
  }
};
