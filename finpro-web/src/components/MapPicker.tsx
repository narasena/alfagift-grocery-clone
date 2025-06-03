"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from "leaflet";
import { LeafletMouseEvent } from 'leaflet';


interface LocationSelectorProps {
  setFieldValue: (fieldName: string, value: number | string) => void;
  address?: string;
}

interface MapPickerProps {
  setFieldValue: (fieldName: string, value: number | string) => void;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
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
    if (address && address.trim() !== '') {
      searchAddress(address);
    }
  }, [address]);

  const searchAddress = async (address: string) => {
    setIsSearching(true);
    try {
      // ⚠️ WAJIB: Delay minimal 1 detik untuk menghindari rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            // ⚠️ GANTI dengan info aplikasi Anda
            'User-Agent': 'FinproGroceryApp/1.0 (jessechristianmambu.12@gmail.com)',
          },
        }
      );
  
      if (!response.ok) throw new Error("Gagal mencari alamat");
  
      const data = await response.json();
      if (data.length === 0) throw new Error("Alamat tidak ditemukan");
  
      const { lat, lon, display_name, address: details } = data[0];
      const newPosition = new LatLng(parseFloat(lat), parseFloat(lon));
  
      setPosition(newPosition);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lon);
      map.flyTo(newPosition, 15);
  
      // Auto-fill alamat jika tersedia
      setFieldValue("address", display_name || address);
      if (details) {
        setFieldValue("village", details.village || "");
        setFieldValue("subDistrict", details.county || "");
        setFieldValue("city", details.city || details.town || "");
        setFieldValue("province", details.state || "");
        setFieldValue("postcode", details.postcode || "");
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
      setFieldValue("latitude", newPosition.lat);
      setFieldValue("longitude", newPosition.lng);
    },
  });

  return (
    <>
      {isSearching && (
        <div className="absolute z-[1000] bg-white p-2 rounded shadow-md">
          Mencari alamat...
        </div>
      )}
      {position && <Marker position={position} />}
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
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Masukkan alamat lengkap"
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
      
      <div className="h-64 w-full">
        <MapContainer 
          center={[-6.200000, 106.816666]} 
          zoom={13} 
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector 
            setFieldValue={setFieldValue} 
            address={tempAddress}
          />
        </MapContainer>
      </div>
    </div>
  );
}