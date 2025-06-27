import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";

export const createPaymentImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload;
  } catch (error) {
    next(error);
  }
};
