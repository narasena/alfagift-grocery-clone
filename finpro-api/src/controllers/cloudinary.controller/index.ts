import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

export async function handleSignedupload(req: Request, res: Response, next: NextFunction) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    const { paramsToSign } = req.body;
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
    res.status(200).json({
      signature,
    });
  } catch (error) {
    next(error);
  }
}
