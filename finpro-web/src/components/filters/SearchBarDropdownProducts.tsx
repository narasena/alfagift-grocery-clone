import { useAllProducts } from "@/features/admin/products/hooks/useAllProducts";
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
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
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-80 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Link
              href={`/p/${product.slug}`}
              key={product.id}
              onClick={() => {
                onProductSelect?.(product);
                setSearchTerm("");
                setIsOpen(false);
              }}
              className="block px-4 py-3 hover:bg-gray-200 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CldImage
                    width={40}
                    height={40}
                    src={product?.productImage.find((image) => image.isMainImage)?.imageUrl ?? "/"}
                    alt={product.name}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-sm font-semibold text-red-600">
                    {product.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
