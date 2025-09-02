import { prisma } from "../../prisma";
import { IPriceCutSelectedProduct, TDiscountType } from "../../types/discount.type";
import { Prisma } from "../../generated/prisma/client";

export async function createDiscountService({
  name,
  description,
  discountType,
  discountValue,
  startDate,
  endDate,
  minPurchaseValue,
  usageLimitPerTransaction,
  isGlobalStore,
  selectedStores,
  isGlobalProduct,
  selectedProducts,
  toBeDiscountedProducts,
}: {
  name: string;
  description?: string;
  discountType: TDiscountType;
  discountValue?: number;
  startDate: string;
  endDate: string;
  minPurchaseValue?: number;
  usageLimitPerTransaction?: number;
  isGlobalStore: boolean;
  selectedStores: string[];
  isGlobalProduct: boolean;
  selectedProducts: string[];
  toBeDiscountedProducts: IPriceCutSelectedProduct[];
}) {
  if (!name || !discountType || !startDate || !endDate) {
    throw { isExpose: true, status: 400, message: "Name, discount type, start date, and end date are required" };
  }
  const throwError = (message: string) => {
    throw { isExpose: true, status: 400, message };
  };

  const isEmpty = (value: string | number | undefined | null) => [null, 0, "", undefined].includes(value);

  // Common store validation
  if (!isGlobalStore && selectedStores.length === 0) {
    throwError("Selected stores are required");
  }

  // Type-specific validations
  const validations = {
    PERCENTAGE: () => {
      if (!isGlobalProduct && toBeDiscountedProducts.length === 0) {
        throwError("Selected products and discount value are required");
      } else if (isGlobalProduct && isEmpty(discountValue)) {
        throwError("Discount value is required");
      }
    },
    FIXED_AMOUNT: () => validations.PERCENTAGE(), // Same as PERCENTAGE
    BUY1_GET1: () => {
      if (!isGlobalProduct && selectedProducts.length === 0) {
        throwError("Selected products are required");
      }
    },
    MIN_PURCHASE: () => {
      if (isEmpty(minPurchaseValue)) {
        throwError("Min purchase value is required");
      }
    },
  };

  validations[discountType as TDiscountType]?.();

  const utcStartDate = new Date(new Date(startDate).getTime() - 7 * 60 * 60 * 1000);
  const utcEndDate = new Date(new Date(endDate).getTime() - 7 * 60 * 60 * 1000);

  const createdDiscount = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const discount = await tx.productDiscount.create({
      data: {
        name,
        description: description === "" ? null : (description ?? null),
        discountType,
        minPurchaseValue: discountType === "MIN_PURCHASE" ? Number(minPurchaseValue) : null,
        startDate: utcStartDate,
        endDate: utcEndDate,
        isActive: true,
        isGlobalStore,
        isGlobalProduct,
        usageLimitPerTransaction: isEmpty(usageLimitPerTransaction) ? null : Number(usageLimitPerTransaction),
      },
    });

    // Store Discount History
    const storeIds = isGlobalStore
      ? (await tx.store.findMany()).map((store: { id: string }) => store.id)
      : selectedStores;

    let appliedStores: any = null;
    if (storeIds.length > 0) {
      appliedStores = await tx.storeDiscountHistory.createMany({
        data: storeIds.map((storeId: string) => ({
          storeId,
          discountId: discount.id,
        })),
      });
    }

    // Product Discount History
    let discountedProducts: any = null;
    if (["PERCENTAGE", "FIXED_AMOUNT", "BUY1_GET1"].includes(discountType)) {
      const productData = isGlobalProduct
        ? (await tx.product.findMany()).map((product: { id: string }) => ({
            productId: product.id,
            discountId: discount.id,
            discountValue: discountType !== "BUY1_GET1" ? Number(discountValue) : null,
          }))
        : discountType === "BUY1_GET1"
          ? selectedProducts.map((productId: string) => ({
              productId,
              discountId: discount.id,
            }))
          : (toBeDiscountedProducts as IPriceCutSelectedProduct[]).flatMap((group) =>
              group.productIds.map((productId) => ({
                productId,
                discountId: discount.id,
                discountValue: Number(group.discountValue),
              })),
            );

      if (productData.length > 0) {
        discountedProducts = await tx.productDiscountHistory.createMany({ data: productData });
      }
    }

    return { discount, appliedStores, discountedProducts };
  });

  return createdDiscount;
}

export async function getDiscountsService() {
  const discounts = await prisma.productDiscount.findMany({
    include: {
      productDiscountHistories: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              productImage: {
                take: 1,
                where: { isMainImage: true },
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
      storeDiscountHistories: {
        select: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  });
  return discounts;
}
