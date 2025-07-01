import axios from "axios";

const API_URL = "https://api.rajaongkir.com/starter"; // versi starter
const API_KEY = process.env.RAJAONGKIR_API_KEY!;

export const getProvinces = async () => {
  const { data } = await axios.get(`${API_URL}/province`, {
    headers: { key: API_KEY },
  });
  return data.rajaongkir.results;
};

export const getCities = async (provinceId: string) => {
  const { data } = await axios.get(`${API_URL}/city?province=${provinceId}`, {
    headers: { key: API_KEY },
  });
  return data.rajaongkir.results;
};

export const calculateCost = async ({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}) => {
  const { data } = await axios.post(
    `${API_URL}/cost`,
    {
      origin,
      destination,
      weight,
      courier,
    },
    {
      headers: {
        key: API_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.rajaongkir.results[0].costs;
};
