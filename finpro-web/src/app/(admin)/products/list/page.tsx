"use client";
import apiInstance from "@/utils/apiInstance";
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import * as React from "react";
import { toast } from "react-toastify";

export default function AdminProductListViewPage() {
  const [products, setProducts] = React.useState<IProductDetails[]>([]);
  const handleGetProducts = async () => {
    try {
      const response = await apiInstance.get("/product/all");
      setProducts(response.data.products);
      console.log(`Products: `, response.data.products);
      toast.success(response.data.message);
    } catch (error) {
      console.error(`Error fetching products: `, error);
      toast.error(`Failed to fetch products. Please try again later.`);
    }
  };
  const productsListTitle = [
    { key: "image", title: "Image" },
    { key: "name", title: "Product Name" },
    { key: "brand", title: "Brand" },
    { key: "category", title: "Category" },
    { key: "subCategory", title: "Sub Category" },
    { key: "price", title: "Price" },
    { key: "description", title: "Description" },
    { key: "sku", title: "SKU" },
    { key: "barcode", title: "Barcode" },
    { key: "weight", title: "Weight" },
    { key: "dimensions", title: "Dimensions" },
    { key: "action", title: "Actions" },
  ];
  const getProductCellValue = (product: IProductDetails, key: string) => {
    switch (key) {
      case "image":
        return (
          <CldImage
            src={product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? ""}
            width={60}
            height={60}
            alt={product.name}
          />
        );
      case "name":
        return (
          <Link href={`/p/${product.slug}`} className="text-blue-600 hover:underline hover:font-medium">
            {product.name || "—"}
          </Link>
        );
      case "brand":
        return product.productBrand?.name || "—";
      case "category":
        return product.productSubCategory.productCategory.name || "—";
      case "subCategory":
        return product.productSubCategory.name || "—";
      case "action":
        return (
          <Link href={`/admin/products/edit/${product.id}`} className="font-medium text-blue-600 hover:underline">
            Edit
          </Link>
        );
      default:
        return (product[key as keyof IProductDetails] as string | number) || "—";
    }
  };

  React.useEffect(() => {
    handleGetProducts();
  }, []);
  return (
    <div className="p-4 bg-red-200">
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            {`Admin's Products List View`}
            <p className="mt-1 text-sm font-normal text-gray-500">
              {`List of all products that are registered within the system. To view stocks / inventories, please click `}
              <Link href={""} className="font-medium text-blue-600 hover:underline">
                {`here.`}
              </Link>
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {productsListTitle.map((title, index) => (
                <th scope="col" key={index} className="px-6 py-3">
                  {title.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                {productsListTitle.map((title, indx) => (
                  <td key={indx} className="px-6 py-4">
                    {getProductCellValue(product, title.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
