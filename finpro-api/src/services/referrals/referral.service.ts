import { prisma } from "@/prisma"

export default class ReferralService {
  public async findUserReferral(referralCode: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          referralCode
        }
      })
      if (!user) {
        throw {
          isExpose: true,
          status: 404,
          success: false,
          message: "User with this referral code not found",
        };
      }
      return user
    } catch (error) {
      throw error
    }
  }
}