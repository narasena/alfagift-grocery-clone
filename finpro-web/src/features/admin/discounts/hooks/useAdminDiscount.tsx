import { EDiscountType, IDiscountResponse } from "@/types/discounts/discount.type";
import apiInstance from "@/utils/api/apiInstance";
import {  AxiosError } from "axios";
// import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

export const useAdminDiscount = () => {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  const [discounts, setDiscounts] = React.useState<IDiscountResponse[]>([]);

  React.useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await apiInstance.get("/discounts/all");
        setDiscounts(response.data.discounts);
      } catch (error) {
        const errResponse = error as AxiosError<{ message: string }>;
        toast.error(errResponse.response?.data.message);
        console.error(error);
      }
    };
    fetchDiscounts();
  }, []);

  const discountsTitle = [
    { key: "index", label: "No" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "discountType", label: "Discount Type" },
    { key: "start", label: "Start Date" },
    { key: "end", label: "End Date" },
    { key: "store", label: "Store" },
    { key: "product", label: "Product" },
    { key: "actions", label: "Actions" },
  ];

  const typeColor = [
    { key: EDiscountType.PERCENTAGE, color: "bg-red-500" },
    { key: EDiscountType.FIXED_AMOUNT, color: "bg-blue-500" },
    { key: EDiscountType.BUY1_GET1, color: "bg-yellow-500" },
    { key: EDiscountType.MIN_PURCHASE, color: "bg-green-500" },
  ];

  const discountIdIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    discounts.forEach((disc) => {
      if (!map.has(String(disc.id))) {
        map.set(String(disc.id), map.size + 1);
      }
    });
    return map;
  }, [discounts]);

  const renderDiscountsCell = (discount: IDiscountResponse, key: string) => {
    switch (key) {
      case "index":
        return discountIdIndexMap.get(String(discount.id)) || 0;
      case "start":
        return (
          new Date(discount.startDate).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "end":
        return (
          new Date(discount.endDate).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "store":
        return (
          <div className="flex flex-wrap gap-1">
            {!discount.isGlobalStore? (discount.storeDiscountHistories.map((store, index) => (
              <div key={index} className="px-1 py-0.5 w-max text-xs font-medium bg-red-600 text-white rounded-sm">
                {store.store?.name || "—"}
              </div>
            ))) : (
              <div className="px-1 py-0.5 w-max text-xs font-medium bg-pink-800 text-white rounded-sm">
                ALL STORES
              </div>
            )}
          </div>
        );
      case "discountType":
        return (
          <div>
            {discount.discountType && typeColor.find((type) => type.key === discount.discountType)?.color && (
              <div
                className={`px-1 py-0.5 w-max text-xs font-medium ${
                  typeColor.find((type) => type.key === discount.discountType)?.color
                } text-white rounded-sm`}
              >
                {discount.discountType}
              </div>
            )}
          </div>
        );

      case "product":
        return (
          <div className="flex flex-wrap gap-1">
            {!discount.isGlobalProduct ? (
              discount.productDiscountHistories.map((product, index) => (
                <div key={index} className="px-1 py-0.5 w-max text-xs font-medium bg-red-200 text-red-600 rounded-sm">
                  {product.product?.name || "—"}
                </div>
              ))
            ) : (
              <div className="px-1 py-0.5 w-max text-xs font-medium bg-red-200 text-red-600 rounded-sm">
                All Products
              </div>
            )}
          </div>
        );
      default:
        return String(discount[key as keyof typeof discount]) || "—";
    }
  };

  return { discounts, discountsTitle, renderDiscountsCell };
};
