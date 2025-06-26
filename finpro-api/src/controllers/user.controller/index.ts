import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";

export const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.payload?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const addresses = await prisma.userAddress.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        isMainAddress: "desc",
      },
      select: {
        id: true,
        address: true,
        subDistrict: true,
        district: true,
        city: true,
        province: true,
        postalCode: true,
        isMainAddress: true,
        latitude: true,
        longitude: true,
      },
    });

    res.status(200).json(addresses);
  } catch (error) {
    next({
      status: 500,
      message: "Gagal mengambil daftar alamat user",
      isExpose: true,
    });
  }
};
