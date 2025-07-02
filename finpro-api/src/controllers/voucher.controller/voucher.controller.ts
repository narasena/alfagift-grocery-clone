import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export async function getUserVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req.body.payload)?.userId

        const vouchers = await prisma.voucher.findMany({
            where: {
                userId,
                expiredDate: {
                    gte: new Date()
                },
            }
        })
        res.status(200).json({
            success: true,
            message: "Vouchers found",
            vouchers
        });

    } catch (error) {
        next(error);
    }
}