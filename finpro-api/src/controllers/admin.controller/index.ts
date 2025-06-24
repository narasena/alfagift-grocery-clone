import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { jwtSignAdmin } from "../../utils/jwt.sign";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import jwt from "jsonwebtoken";

export enum AdminRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
}

export interface IAdmin {
  id?: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  isEmailVerified?: boolean;
  passwordResetCount?: number;
  emailChangeCount?: number;
  avatarImgUrl?: string | null;
  cldPublicId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  storeId: string;
}

interface RequestWithAdmin extends Request {
  admin: {
    adminId: string;
    role: string;
    isEmailVerified: boolean;
  };
}

export const registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phoneNumber, storeId, role } = req.body;

    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingAdmin) {
      throw { 
        isExpose: true, 
        status: 409, 
        message: "Email atau nomor telepon sudah terdaftar" 
      };
    }

    // Hash password sebelum disimpan
    const hashedPassword = await hashPassword(password);

    // Buat admin baru
    const newAdmin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        storeId,
        isEmailVerified: false,
      },
    });

    // Response sukses
    res.status(201).json({ 
      message: "Admin toko berhasil didaftarkan", 
      data: newAdmin 
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Cari admin berdasarkan email
    const findAdmin = await prisma.admin.findUnique({ 
      where: { email } 
    });

    if (!findAdmin) {
      throw { 
        isExpose: true, 
        status: 404, 
        message: "Email tidak ditemukan" 
      };
    }

    // Verifikasi password
    const isPasswordMatch = await comparePassword(password, findAdmin.password);

    if (!isPasswordMatch) {
      throw { 
        isExpose: true, 
        status: 401, 
        message: "Password salah" 
      };
    }

    // Buat token JWT
    const token = jwtSignAdmin({ 
      adminId: findAdmin.id, 
      email: findAdmin.email, 
      role: findAdmin.role 
    });

    // Response sukses login
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        adminId: findAdmin.id,
        email: findAdmin.email,
        role: findAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const sessionLoginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { payload } = req.body;

    if (!payload.adminId) {
      throw {
        status: 401,
        isExpose: true,
        message: "Unauthorized: Bukan token admin",
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
    });

    if (!admin) {
      throw {
        status: 404,
        isExpose: true,
        message: "Admin tidak ditemukan",
      };
    }

    const token = req.headers.authorization?.split(" ")[1];

    res.status(200).json({
      success: true,
      message: "Session login admin berhasil",
      data: {
        token,
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

