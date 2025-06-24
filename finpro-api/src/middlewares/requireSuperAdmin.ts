import { Request, Response, NextFunction } from "express";

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Payload JWT:", req.body.payload);
    const { payload } = req.body;

    if (!payload || payload.role !== "SuperAdmin") {
      throw {
        status: 403,
        isExpose: true,
        message: "Akses ditolak: Hanya SuperAdmin yang dapat mengakses fitur ini",
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};