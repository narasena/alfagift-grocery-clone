import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign, jwtSignAdmin } from "../../utils/jwt.sign";
import { transporter } from "../../utils/transporter.mailer";

// Step 1: Register only with email
export const registerWithEmailOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: "",
        password: "",
        email,
        isEmailVerified: false,
        passwordResetCount: 0,
        emailChangeCount: 0,
      },
    });

    const link = `${process.env.CLIENT_URL}/register-verify-email?email=${email}`;

    await transporter.sendMail({
      to: email,
      subject: "Verifikasi Email Anda",
      html: `
        <p>Halo,</p>
        <p>Klik tombol di bawah untuk memverifikasi email Anda:</p>
        <a href="http://localhost:8000/api/auth/verify-email?email=${email}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none;">Verifikasi Email</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Link verifikasi telah dikirim ke email Anda.",
    });
  } catch (err) {
    next(err);
  }
};

// Step 2: Verifikasi email saat link diklik
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query as { email: string }

    if (!email || typeof email !== "string") {
      res.status(400).json({ success: false, message: "Email tidak valid." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    if (user?.isEmailVerified) {
       res.redirect(`${process.env.CLIENT_URL}/register-verify-email?email=${email}&status=verified`);
    }

    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

     res.redirect(`${process.env.CLIENT_URL}/register-verify-email?email=${email}&status=verified`);
  } catch (err) {
    next(err);
  }
};

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

    await transporter.sendMail({
      to: email,
      subject: `Verivikasi Email Anda`,
      text: `Halo ${firstName} Terima kasih telah mendaftar di Alfagift! Untuk menyelesaikan proses pendaftaran, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:`,
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
