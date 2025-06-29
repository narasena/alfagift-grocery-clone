"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";

interface ILocationResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    village: string;
    sub_district: string;
    city: string;
    province: string;
    postcode: string;
    country: string;
    suburb: string;
    county: string;
    state: string;
    town: string;
    municipality: string;
    city_district: string;
    neighbourhood: string;
    residential: string;
  };
}

interface LocationSelectorProps {
  setFieldValue: (fieldName: string, value: string | number) => void;
  address?: string;
}

interface MapPickerProps {
  setFieldValue: (fieldName: string, value: string | number) => void;
}

interface ILeafletIconDefault extends L.Icon.Default {
  _getIconUrl?: (name: string) => string;
}

delete (L.Icon.Default.prototype as ILeafletIconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationSelector = ({ setFieldValue, address }: LocationSelectorProps) => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (address && address.trim() !== "") {
      searchAddress(address);
    }
  }, [address]);

  const searchAddress = async (address: string) => {
    setIsSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Nominatim rule

      const response = await axios.get(`http://localhost:8000/api/geocode?q=${encodeURIComponent(address)}`);

      const result: ILocationResult = response.data[0];
        console.log("Data dari API Geocode:", { 
        lat: result.lat, 
        lon: result.lon,
        typeLat: typeof result.lat,
        typeLon: typeof result.lon
      });
      if (!result) throw new Error("Gagal mencari alamat");

      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      setPosition(new LatLng(lat, lon));
      map.flyTo([lat, lon], 15);

      // Set field ke Formik
      setFieldValue("latitude", result.lat);
      setFieldValue("longitude", result.lon);
      setFieldValue("address", result.display_name || address);

      const details = result.address;
      if (details) {
        setFieldValue("subDistrict", details.village || details.neighbourhood || details.residential || "");
        setFieldValue("district", details.suburb || details.county || "");
        setFieldValue("city", details.city_district || details.town || details.municipality || "");
        setFieldValue("province", details.state || details.city || "");
        setFieldValue("postalCode", details.postcode || "");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mencari alamat. Coba lagi atau pilih manual di peta.");
    } finally {
      setIsSearching(false);
    }
  };

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      setFieldValue("latitude", newPosition.lat.toString());
      setFieldValue("longitude", newPosition.lng.toString());
    },
  });

  return (
    <>
      {isSearching && (
        <div className="absolute z-[1000] bg-white p-2 rounded shadow-md">Mencari alamat...</div>
      )}
      {position && <Marker position={[position.lat, position.lng]} />}
    </>
  );
};

export default function MapPicker({ setFieldValue }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempAddress, setTempAddress] = useState("");

  const handleSearch = () => {
    setTempAddress(searchQuery);
  };

  return (
    <div className="space-y-2 text-black">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Masukkan nama alamat"
          className="flex-1 px-3 py-2 border border-gray-400 rounded-md text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          type="button"
        >
          Cari
        </button>
      </div>

      <div className="h-50 w-full">
        <MapContainer center={[-6.2, 106.816666]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector key={tempAddress} setFieldValue={setFieldValue} address={tempAddress} />
        </MapContainer>
      </div>
    </div>
  );
}
