import { NextFunction, Request, Response } from "express";
import { prisma } from '../../prisma'

export async function findReferral(req: Request, res: Response, next: NextFunction) {
    try {
        const { referralCode } = req.params
        const user = await prisma.user.findUnique({
            where: {
                referralCode
            }
        })
        if(!user) {
            throw {
              isExpose: true,
              status: 400,
              success: false,
              message: "User with this referral code not found",
            };
        }

        res.status(200).json({
          success: true,
          message: "Referral code found",
          referralCode: user.referralCode,
        });
        
    } catch (error) {
        next(error)
    }
}
