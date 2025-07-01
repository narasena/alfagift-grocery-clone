import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload;
    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    const { paymentType, paymentMethod, paymentAmount, notes } = req.body;
    const { orderId } = req.params;

    if (!orderId || !paymentType || !paymentMethod || !paymentAmount) {
      throw new AppError("Some fields are missing.", 400);
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentType,
        paymentMethod,
        paymentAmount,
        paymentDate: new Date(),
        notes,
      },
    });

    await prisma.paymentHistory.create({
      data: {
        paymentId: payment.id,
        paymentStatus: "PENDING",
      },
    });

    res.status(201).json({
      message: "Payment created",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

export const createPaymentImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload;
    const { paymentId, imageUrl, cldPublicId } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    if (!paymentId) {
      throw new AppError("Payment ID is required.", 400);
    }

    if (!imageUrl || !cldPublicId) {
      throw new AppError("Cloudinary upload result is missing.", 400);
    }

    // Make sure the payment exists
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new AppError("Payment not found.", 404);
    }

    // Create the payment proof
    const paymentProof = await prisma.paymentProof.create({
      data: {
        paymentId,
        imageUrl,
        cldPublicId,
        status: "PENDING", // default status
      },
    });

    res.status(201).json({
      message: "Payment proof uploaded successfully.",
      paymentProof,
    });
  } catch (error) {
    next(error);
  }
};
