import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { hashPassword } from "../../utils/hash.password";
import { comparePassword } from "../../utils/compare.password";
import { jwtSign, jwtSignAdmin } from "../../utils/jwt.sign";
import generateCodeTenChars from "../../utils/code.generator/codeGeneratorTenChars";
import { Prisma } from "@prisma/client";
import { DiscountValueType, VoucherType } from "../../generated/prisma";
import { transporter } from "../../utils/transporter.mailer";

// Step 1: Register only with email
export const registerWithEmailOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await hashPassword(password);

      await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: "",
        isEmailVerified: false,
        passwordResetCount: 0,
        emailChangeCount: 0,
        referralCode: generateCodeTenChars(),
      },
    });

    const verificationLink = `${process.env.API_URL}/api/user/verify-email?email=${email}`;

    // Kirim email verifikasi
    await transporter.sendMail({
      to: email,
      subject: "Verifikasi Email Anda",
      html: `
        <p>Halo,</p>
        <p>Klik tombol di bawah untuk memverifikasi email Anda:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none;">Verifikasi Email</a>
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
    const { email } = req.query as { email?: string };

    if (!email || typeof email !== "string") {
      res.status(400).json({ success: false, message: "Email tidak valid." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    if (user?.isEmailVerified) {
      // Sudah diverifikasi sebelumnya
      res.redirect(`${process.env.CLIENT_URL}/register-verify-email?email=${email}&status=verified`);
    }

    // Update user menjadi verified
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
      appliedReferralCode,
    } = req.body;

    // Cek user berdasarkan email (harus sudah terdaftar)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw {
        isExpose: true,
        status: 404,
        message: "User not found",
      };
    }

    const hashedPassword = await hashPassword(password);

    // Generate referralCode baru hanya jika belum ada
    let referralCode = existingUser.referralCode || generateCodeTenChars();
    while (await prisma.user.findFirst({ where: { referralCode } })) {
      referralCode = generateCodeTenChars();
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedUser = await tx.user.update({
        where: { email },
        data: {
          firstName,
          lastName,
          password: hashedPassword,
          phoneNumber,
          gender,
          dateOfBirth,
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

      const userId = updatedUser.id;

      // Jika ada kode referral yang diterapkan
      if (appliedReferralCode && appliedReferralCode !== "") {
        const referrerId = (await tx.user.findUnique({ where: { referralCode: appliedReferralCode } }))?.id;

        if (!referrerId) {
          throw new Error(`Invalid referral code: ${appliedReferralCode}`);
        }

        const referral = await tx.referral.create({
          data: {
            referrerId,
            refereeId: userId,
          },
        });

        const voucher = await tx.voucher.create({
          data: {
            name: `Referral Voucher [${appliedReferralCode}]`,
            voucherType: VoucherType.REFERRAL,
            discountValueType: DiscountValueType.PERCENTAGE,
            discountValue: 10,
            userId,
            referralId: referral.id,
            expiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });

        return { updatedUser, referral, voucher };
      }

      return { updatedUser };
    });

    // Kirim email konfirmasi selesai
    await transporter.sendMail({
      to: email,
      subject: `Verifikasi Email Anda`,
      text: `Halo ${firstName}, Terima kasih telah melengkapi pendaftaran di Alfagift!`,
    });

    res.status(200).json({
      success: true,
      message: `User dengan email ${email} berhasil diperbarui.`,
      data: result,
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
        message: `Login sukses, selamat datang ${findUser.firstName}`,
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

export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email wajib diisi");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User tidak ditemukan");

    const resetLink = `http://localhost:3000/reset-password/confirm?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: `"Support" <${process.env.TRANSPORTER_MAILER_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `<p>Silakan klik link berikut untuk mengatur ulang password Anda:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ success: true, message: "Link reset password berhasil dikirim ke email Anda" });
  } catch (error) {
    next(error);
  }
};

export const confirmResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) throw new Error("Email dan password baru wajib diisi");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User tidak ditemukan");

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ success: true, message: "Password berhasil diperbarui" });
  } catch (error) {
    next(error);
  }
};