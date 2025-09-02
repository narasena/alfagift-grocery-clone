import { NextFunction, Request, Response } from "express";
import { createDiscountService, getDiscountsService } from "@/services/discount/discount.service";

export async function createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
        const createdDiscount = await createDiscountService(req.body);
        res.status(200).json({
            success: true,
            message: "Create discount successful",
            createdDiscount
        });
    } catch (error) {
        next(error);
    }
}

export async function getDiscounts(req: Request, res: Response, next: NextFunction) {
  try {
    const discounts = await getDiscountsService();
    res.status(200).json({
      success: true,
      message: "Get discounts successful",
      discounts
    });
  } catch (error) {
    next(error);
  }
}