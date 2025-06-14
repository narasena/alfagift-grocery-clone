import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stocks = await prisma.productStock.findMany({
            where: { deletedAt: null },
            include: {
                product: true,
                store: true
            }
        });
        res.status(200).json({
            success: true,
            message: "Stocks fetched successfully",
            stocks
        });
    } catch (error) {
        next(error);
        
    }
}