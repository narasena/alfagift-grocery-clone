import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export async function getAllAdmins(req: Request, res: Response, next: NextFunction) {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        deletedAt: null,
      },
    });
    if (admins.length === 0) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "There is no admin yet",
      };
    }

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      admins,
    });
  } catch (error) {
    next(error);
  }
}
