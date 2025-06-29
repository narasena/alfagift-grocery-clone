import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign, jwtSignAdmin } from "../../utils/jwt.sign";
import generateCodeTenChars from "../../utils/code.generator/codeGeneratorTenChars";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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

    // referral
    let referralCode = generateCodeTenChars();
    while (await prisma.user.findFirst({ where: { referralCode } })) {
      referralCode = generateCodeTenChars();
    }

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
        referralCode,
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


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findFirst({ where: { email } });
    const findAdmin = await prisma.admin.findFirst({ where: { email } });

    if (!findUser && !findAdmin) {
      throw { isExpose: true, status: 404, message: "User not found" };
    }

    let token: string;
    let role: string;

    if (findUser) {
      const isPasswordMatch = await comparePassword(password, findUser.password);
      if (!isPasswordMatch) throw { isExpose: true, status: 401, message: "Invalid password" };

      token = jwtSign({
        userId: findUser.id,
        email: findUser.email,
        isEmailVerified: findUser.isEmailVerified,
      });
      role = "user";

      res.status(200).json({
        success: true,
        message: "Login success (user)",
        data: { token, role, userId: findUser.id, email: findUser.email },
      });
    }

    if (findAdmin) {
      const isPasswordMatch = await comparePassword(password, findAdmin.password);
      if (!isPasswordMatch) throw { isExpose: true, status: 401, message: "Invalid password" };

      token = jwtSignAdmin({
        adminId: findAdmin.id,
        email: findAdmin.email,
        role: findAdmin.role,
      });
      role = findAdmin.role.toLowerCase();

      res.status(200).json({
        success: true,
        message: "Login success (admin)",
        data: {
          token,
          role,
          adminId: findAdmin.id,
          email: findAdmin.email,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};



export const sessionLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload } = req.body;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) throw { status: 404, isExpose: true, message: "User tidak ditemukan" };

    const token = req.headers.authorization?.split(" ")[1];

    res.status(200).json({
      success: true,
      message: "Session login user berhasil",
      data: {
        token,
        userId: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
