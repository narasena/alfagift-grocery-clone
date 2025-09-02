import { prisma } from "../../prisma";

export async function getUserVouchersService(userId: string) {
    if (!userId) {
        throw { isExpose: true, status: 401, success: false, message: "No user found" };
    }

    const vouchers = await prisma.voucher.findMany({
        where: {
            userId,
            expiredDate: {
                gte: new Date()
            },
        }
    });
    return vouchers;
}
