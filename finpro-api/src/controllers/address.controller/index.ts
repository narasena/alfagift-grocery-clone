// controllers/userAddressController.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";

export const getUserAddresses = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const addresses = await prisma.userAddress.findMany({ where: { userId, deletedAt: null } });
  res.json(addresses);
};

export const selectUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.payload?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
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

    if (addresses.length === 0) {
      next({
        isExpose: true,
        status: 404,
        success: false,
        message: "User belum memiliki alamat",
      });
      return;
    }

    res.status(200).json(addresses);
  } catch (error) {
    next({
      status: 500,
      message: "Gagal mengambil daftar alamat user",
      isExpose: true,
    });
  }
};
export const createUserAddress = async (req: Request, res: Response) => {
  const { userId, address, subDistrict, district, city, province, postalCode, latitude, longitude } = req.body;
  const addressCount = await prisma.userAddress.count({ where: { userId, deletedAt: null } });
  const isMainAddress = addressCount === 0;

  const newAddress = await prisma.userAddress.create({
    data: {
      userId,
      address,
      subDistrict,
      district,
      city,
      province,
      postalCode,
      latitude,
      longitude,
      isMainAddress,
    },
  });
  res.json(newAddress);
};

export const updateUserAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.userAddress.update({ where: { id }, data: req.body });
  res.json(updated);
};

export const deleteUserAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await prisma.userAddress.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  res.json(deleted);
};

export const setMainAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const current = await prisma.userAddress.findUnique({ where: { id } });
  if (!current) res.status(404).json({ message: "Address not found" });

  await prisma.userAddress.updateMany({
    where: { userId: current?.userId },
    data: { isMainAddress: false },
  });

  const updated = await prisma.userAddress.update({
    where: { id },
    data: { isMainAddress: true },
  });

  res.json(updated);
};
