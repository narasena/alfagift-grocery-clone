import { prisma } from "@/prisma";
import { NextFunction, Request, Response } from "express";
import {TDiscountType} from "../../types/discount.type";
import { Prisma } from "@prisma/client";

export async function createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
        const {
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
            toBeDiscountedProducts
        } = req.body;
        if(!name || !discountType || !startDate || !endDate) {
            throw { isExpose: true, status: 400, message: "Name, discount type, start date, and end date are required" };
        }
        const throwError = (message: string) => {
            throw { isExpose: true, status: 400, message };
        };
        
        const isEmpty = (value: string|number) => [null, 0, "", undefined].includes(value);
        
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
            }
        };
        
        validations[discountType as TDiscountType]?.();

        const key = discountType as TDiscountType;
        
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const discount = await tx.productDiscount.create({
            data: {
              name,
              description: description || null,
              discountType,
              minPurchaseValue: discountType === "MIN_PURCHASE" ? Number(minPurchaseValue) : null,
              startDate,
              endDate,
              isActive: true,
              isGlobalStore,
              isGlobalProduct,
              usageLimitPerTransaction: isEmpty(usageLimitPerTransaction) ? null : Number(usageLimitPerTransaction),
            },
          });

          // Store Discount History
          const storeIds = isGlobalStore ? (await tx.store.findMany()).map((store) => store.id) : selectedStores;

          if (storeIds.length > 0) {
            await tx.storeDiscountHistory.createMany({
              data: storeIds.map((storeId) => ({
                storeId,
                discountId: discount.id,
              })),
            });
          }

          // Product Discount History
          if (["PERCENTAGE", "FIXED_AMOUNT", "BUY1_GET1"].includes(discountType)) {
            const productData = isGlobalProduct
              ? (await tx.product.findMany()).map((product) => ({
                  productId: product.id,
                  discountId: discount.id,
                  discountValue: discountType !== "BUY1_GET1" ? Number(discountValue) : undefined,
                }))
              : discountType === "BUY1_GET1"
                ? selectedProducts.map((productId: string) => ({
                    productId,
                    discountId: discount.id,
                  }))
                : toBeDiscountedProducts.map((product: { id: string; discountValue: number }) => ({
                    productId: product.id,
                    discountId: discount.id,
                    discountValue: Number(product.discountValue),
                  }));

            if (productData.length > 0) {
              await tx.productDiscountHistory.createMany({ data: productData });
            }
          }

          return discount;
        });

        res.status(200).json({
            success: true,
            message: "Create discount successfull",
            result
        });
    } catch (error) {
        next(error);
    }
}