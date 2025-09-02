import { NextFunction, Request, Response } from "express";
import { getUserVouchersService } from "@/services/voucher/voucher.service";

export async function getUserVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req.body.payload)?.userId;
        const vouchers = await getUserVouchersService(userId);
        res.status(200).json({
            success: true,
            message: "Vouchers found",
            vouchers
        });

    } catch (error) {
        next(error);
    }
}