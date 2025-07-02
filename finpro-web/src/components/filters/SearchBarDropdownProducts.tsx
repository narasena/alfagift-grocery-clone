import { useAllProducts } from "@/features/admin/products/hooks/useAllProducts";
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarDropdownProductsProps {
  onProductSelect?: (product: IProductDetails) => void;
}

export default function SearchBarDropdownProducts({ onProductSelect }: SearchBarDropdownProductsProps) {
  const { products } = useAllProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts =
    products?.filter((product) => product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).slice(0, 5) ||
    [];

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {isOpen && debouncedSearchTerm && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onProductSelect?.(product);
                setSearchTerm("");
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                  <div className="flex items-center gap-4">
                      <div>
                          <CldImage width={48} height={48} src={product.productImage.find((image) => image.isMainImage)?.imageUrl} alt={product.name} />
                      </div>
                      <div>
                          
              <div className="font-medium">{product.name}</div>
              <div className="text-sm font-medium text-red-600">
                {product.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </div>
                      </div>
                  </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
