import { Request, Response, NextFunction } from 'express';
import { prisma } from "../../prisma";
import { transporter } from '../../utils/transporter.mailer';

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;

    // Validasi email
    if (!email || typeof email !== 'string') {
      throw {
        isExpose: true,
        status: 400,
        message: "Email is required",
      };
    }

    // Cek user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userAddress: {
          where: { isMainAddress: true },
          take: 1
        },
      },
    });

    if (!user) {
      throw {
        isExpose: true,
        status: 404,
        message: "User not found",
      };
    }

    // Format data response
const userProfile = {
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  gender: user.gender,
  dateOfBirth: user.dateOfBirth,
  emailVerified: user.isEmailVerified,
  photoUrl: user.avatarImgUrl,
  referralCode: user.referralCode,
  address: user.userAddress[0]?.address,
  subDistrict: user.userAddress[0]?.subDistrict,
  district: user.userAddress[0]?.district,
  city: user.userAddress[0]?.city,
  province: user.userAddress[0]?.province,
  postalCode: user.userAddress[0]?.postalCode,
  latitude: user.userAddress[0]?.latitude,
  longitude: user.userAddress[0]?.longitude,
};

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      gender,
      dateOfBirth,
      photoUrl
    } = req.body;

    if (!email) {
      throw {
        isExpose: true,
        status: 400,
        message: "Email is required",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        phoneNumber,
        gender,
        dateOfBirth,
        avatarImgUrl: photoUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const { photoUrl } = req.body;

    if (!email || !photoUrl) {
      throw {
        isExpose: true,
        status: 400,
        message: "Email and photoUrl are required",
      };
    }

    // Validasi ekstensi file
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = photoUrl.substring(photoUrl.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      throw {
        isExpose: true,
        status: 400,
        message: "Invalid file format. Only JPG, JPEG, PNG, and GIF are allowed",
      };
    }

    // Update photoUrl di database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { avatarImgUrl: photoUrl },
      select: {
        id: true,
        email: true,
        avatarImgUrl: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/user.controller.ts
export const changeEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, newEmail } = req.body;

    if (!userId || !newEmail) {
      throw { isExpose: true, status: 400, message: "User ID dan email baru wajib diisi" };
    }

    const existingUser = await prisma.user.findFirst({ where: { email: newEmail } });
    if (existingUser) {
      throw { isExpose: true, status: 400, message: "Email sudah digunakan" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        isEmailVerified: false,
        emailChangeCount: { increment: 1 },
      },
    });

    // Kirim ulang email verifikasi
    const verificationLink = `${process.env.API_URL}/api/user/verify-email?email=${newEmail}`;
    await transporter.sendMail({
      to: newEmail,
      subject: "Verifikasi Email Baru Anda",
      html: `
        <p>Hai,</p>
        <p>Klik link berikut untuk memverifikasi email baru Anda:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background: #1d4ed8; color: white; text-decoration: none;">Verifikasi Email</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Email berhasil diubah. Silakan verifikasi email baru Anda.",
    });
  } catch (error) {
    next(error);
  }
};

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