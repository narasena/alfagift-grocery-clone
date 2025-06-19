import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign } from "../../utils/jwt.sign";

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
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: `user with email ${email} already exist`,
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
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
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const findUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (findUserByEmail === null) {
      throw{isExpose: true, status: 404, message: "Email not found"}
    }

    const isPasswordMatch = await comparePassword(password, findUserByEmail.password);


    if (isPasswordMatch === false) {
      throw{isExpose: true, status: 401, message: "Invalid password"}
    }

    const token = jwtSign({ userId: findUserByEmail?.id, email: findUserByEmail?.email, isEmailVerified: findUserByEmail?.isEmailVerified } )
    console.log(token)

    res.status(200).json({
      success: true,
      message: "Login successfull",
      data: {
        token,
        userId: findUserByEmail.id,
        user: findUserByEmail.email,
        isEmailVerified: findUserByEmail.isEmailVerified 
      },
    })

  } catch (error) {
    next(error);
  }
};

export const sessionLoginUser = async ( req: Request, res: Response, next: NextFunction ) => {
  try{
    const { payload } = req.body;
    
    const findUserByUserId = await prisma.user.findFirst({
      where: {
        id: payload.userId
      }
    })
    res.status(200).json({
      success: true,
      message: "Session Login successfull",
      data: {
        token: req.headers.authorization?.split(" ")[1],
        userId: findUserByUserId?.id,
        user: findUserByUserId?.email,
        isEmailVerified: findUserByUserId?.isEmailVerified 
      },
    })
  }catch (error) {
    next(error);
  }
}
