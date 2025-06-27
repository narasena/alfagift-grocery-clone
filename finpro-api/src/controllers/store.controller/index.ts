import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";


export const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verifikasi token admin (contoh)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw { status: 401, message: "Akses ditolak" };
    console.log(token);

    const { page = 1, limit = 10 } = req.query; // Paginasi

    console.log("Fetching stores..."); //tesss
    const stores = await prisma.store.findMany({
      skip: (+page - 1) * +limit,
      take: +limit,
      select: {
        id: true,
        name: true,
        city: true,
      },
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null }, // Hanya toko aktif
    });

    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw { status: 404, message: "Store tidak ditemukan", isExpose: true };
    }

    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};

export const updateStoreById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, address, city, province, email, phoneNumber, latitude, longitude } = req.body;

    const updated = await prisma.store.update({
      where: { id },
      data: {
        name,
        address,
        city,
        province,
        email,
        phoneNumber,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      address,
      subDistrict,
      district,
      city,
      province,
      postalCode,
      lat: latitude,
      lon: longitude,
      phoneNumber,
      email,
    } = req.body;

    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        subDistrict,
        district,
        city,
        province,
        postalCode,
        latitude: String(latitude),
        longitude: String(longitude),
        phoneNumber,
        email,
      },
    });

    res.status(201).json({
      message: "Store berhasil dibuat",
      data: newStore,
    });
  } catch (error) {
    next(error);
  }
};

export const assignStoreAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, storeId } = req.body;

    if (!adminId || !storeId) {
      throw { status: 400, message: "adminId and storeId are required", isExpose: true };
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw { status: 404, message: "Admin not found", isExpose: true };
    }

    if (admin.role === "SuperAdmin") {
      throw { status: 400, message: "SuperAdmin cannot be assigned to a store", isExpose: true };
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: { storeId },
      include: { store: true },
    });

    res.json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

export const getStoreAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        role: "Admin",
        storeId: undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    res.json(admins);
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.store.delete({ where: { id } });

    res.status(200).json({ message: "Store berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

export const getNearestStoreByAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId } = req.params;

    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    console.log("Alamat latitude:", address?.latitude);
    console.log("Alamat longitude:", address?.longitude);

    if (!address || !address.latitude || !address.longitude) {
      throw {
        status: 404,
        message: "Alamat tidak ditemukan atau belum memiliki koordinat",
        isExpose: true,
      };
    }

    const latitude = parseFloat(address.latitude);
    const longitude = parseFloat(address.longitude);

    // pengecekan bentul lat dan lon
    if (isNaN(latitude) || isNaN(longitude)) {
      throw {
        status: 400,
        message: "Koordinat alamat tidak valid (bukan angka)",
        isExpose: true,
      };
    }

    const nearestStores = await prisma.$queryRawUnsafe<any[]>(`
  SELECT id, name, city, 
    (
      6371 * acos(
        cos(radians(${latitude})) * 
        cos(radians(CAST(latitude AS FLOAT))) * 
        cos(radians(CAST(longitude AS FLOAT)) - radians(${longitude})) +
        sin(radians(${latitude})) * 
        sin(radians(CAST(latitude AS FLOAT)))
      )
    ) AS distance
  FROM "stores"
  WHERE 
    "deletedAt" IS NULL
    AND latitude IS NOT NULL AND latitude != ''
    AND longitude IS NOT NULL AND longitude != ''
  ORDER BY distance ASC
  LIMIT 1
`);

    if (!nearestStores || nearestStores.length === 0) {
      throw { status: 404, message: "Tidak ada store ditemukan", isExpose: true };
    }

    res.status(200).json({
      message: "Toko terdekat berhasil ditemukan",
      nearestStore: nearestStores[0],
    });
  } catch (error) {
    next(error);
  }
};