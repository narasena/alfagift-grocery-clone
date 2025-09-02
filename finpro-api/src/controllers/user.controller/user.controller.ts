import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (users.length === 0) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "There is no user yet",
      };
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
}
