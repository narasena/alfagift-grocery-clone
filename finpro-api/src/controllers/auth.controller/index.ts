import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      dateOfBirth,
      address,
      subDistrict,
      district,
      city,
      province,
      postalCode,
      latitude,
      longitude,
      isMainAddress,
    } = req.body;

    // for already exist user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      res.status(400).json({
        success: false,
        message: `user with email ${email} already exist`,
        data: null,
      });
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        gender,
        dateOfBirth,
        isEmailVerified: false, //for default
        passwordResetCount: 0, //default
        emailChangeCount: 0, //default
        userAddress: {
          create: {
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
        },
      },
      include: {
        userAddress: true,
      },
    });
    res.status(201).json({
      success: true,
      message: `user with email ${email} has been created`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
