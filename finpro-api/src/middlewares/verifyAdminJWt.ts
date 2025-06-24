
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface RequestWithAdmin extends Request {
  admin?: {
    adminId: string;
    role: string;
    isEmailVerified: boolean;
  };
}

export const verifyAdminJWT = (
  req: RequestWithAdmin,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    
  }

  try {
    const token = authHeader!.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET!) as {
      adminId: string;
      role: string;
      isEmailVerified: boolean;
    };

    req.admin = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    
  }
};
