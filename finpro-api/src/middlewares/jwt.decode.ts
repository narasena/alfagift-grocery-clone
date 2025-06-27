import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const jwtDecode = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token:", token); // Debugging line to check the token

    if (!token || token === "null") {
      throw { isExpose: true, status: 401, message: "Token must be provide" };
    }
    const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`);

    if (!req.body) req.body = {}; // 👈 tambahkan ini!

    req.body.payload = payload;
    // req.body.payload = payload;  // kenapa tidak bisa di req.body ?

    next();
  } catch (error) {
    next(error);
  }
};
