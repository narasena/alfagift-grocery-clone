import { NextFunction, Request, Response } from "express";

export async function createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
        const discount = req.body;

        res.status(200).json({
            success: true,
            message: "Create discount successfull",
            discount
        });
    } catch (error) {
        next(error);
    }
}