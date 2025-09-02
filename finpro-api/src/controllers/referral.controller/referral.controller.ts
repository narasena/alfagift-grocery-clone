import { NextFunction, Request, Response } from "express";
import ReferralService from "@/services/referrals/referral.service";

export async function findReferral(req: Request, res: Response, next: NextFunction) {
  try {
    const { referralCode } = req.params;
    const referralService = new ReferralService();
    const user = await referralService.findUserReferral(referralCode);

    res.status(200).json({
      success: true,
      message: "Referral code found",
      referralCode: user.referralCode,
    });
  } catch (error) {
    next(error);
  }
}
