// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const jwtDecode = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token || token === "null") {
//       throw { isExpose: true, status: 401, message: "Token must be provide" };
//     }
//     const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`); // token dirubah jadi bentuk asli
//     if (!req.body) req.body = {};

//     req.body.payload = payload;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// middlewares/jwtDecode.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const jwtDecode = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw { status: 401, isExpose: true, message: "Unauthorized" };

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    if (!req.body) req.body = {}; //kemungkinan next baru mengirim req.body sebagai null dulu (karena datanya banyak)
    req.body.payload = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
