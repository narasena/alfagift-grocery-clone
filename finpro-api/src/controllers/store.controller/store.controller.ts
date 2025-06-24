import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stores = await prisma.store.findMany({where: {deletedAt: null}});
        res.status(200).json({
            success: true,
            message: "Stores fetched successfully",
            stores
        });
    } catch (error) {
        next(error);
    }
}