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

    // Make sure the payment has an orderId
    if (!payment.orderId) {
      throw new AppError("Payment is not linked to any order.", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the payment proof
      const paymentProof = await tx.paymentProof.create({
        data: {
          paymentId,
          imageUrl,
          cldPublicId,
          status: "PENDING", // default status
        },
      });
      // Create new OrderHistory entry
      const orderHistory = await tx.orderHistory.create({
        data: {
          orderId: payment.orderId,
          status: "WAITING_FOR_CONFIRMATION",
        },
      });
      return { paymentProof, orderHistory };
    });

    res.status(201).json({
      message: "Payment proof uploaded successfully.",
      paymentProof: result.paymentProof,
    });
  } catch (error) {
    next(error);
  }
};

// display users with pending payment
export const getPendingPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        paymentType: "BANK_TRANSFER",
      },
      select: {
        id: true, // paymentId
        paymentHistory: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            paymentStatus: true,
          },
        },
        order: {
          select: {
            id: true,
            finalTotalAmount: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            orderItems: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // 2️⃣ Filter only payments whose latest PaymentHistory is PENDING
    const pendingPayments = payments.filter((p) => p.paymentHistory[0]?.paymentStatus === "PENDING");

    // 3️⃣ Transform to desired output
    const result = pendingPayments.map((p) => {
      const order = p.order;
      return {
        paymentId: p.id, // ✅ so buttons work
        firstName: order?.user.firstName,
        lastName: order?.user.lastName,
        numberOfProducts: order?.orderItems.length,
        totalAmount: order?.finalTotalAmount,
        orderId: order?.id,
      };
    });

    res.status(200).json({
      message: "Pending payments fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentImageUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;
    console.log(paymentId);

    if (!paymentId) {
      throw new AppError("paymentId parameter is required.", 400);
    }

    const paymentProofs = await prisma.paymentProof.findMany({
      where: {
        paymentId,
      },
      select: {
        id: true,
        imageUrl: true,
        status: true,
      },
    });

    res.status(200).json({
      message: "Payment proofs fetched successfully.",
      paymentProofs,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrRejectPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { paymentId } = req.params;
  const { action } = req.body; // still keep `action` in body: "ACCEPT" | "REJECT"

  if (!paymentId || !action) {
    throw new AppError("Missing paymentId or action.", 400);
  }

  try {
    // 1️⃣ Get payment and order
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    let paymentStatus;
    let orderStatus;

    if (action === "ACCEPT") {
      paymentStatus = "SUCCESS";
      orderStatus = "PROCESSING";
    } else if (action === "REJECT") {
      paymentStatus = "FAILED";
      orderStatus = "WAITING_FOR_PAYMENT";
    } else {
      throw new AppError("Invalid action.", 400);
    }

    // 2️⃣ Create PaymentHistory
    await prisma.paymentHistory.create({
      data: {
        paymentId: payment.id,
        paymentStatus: paymentStatus as any,
      },
    });

    // 3️⃣ Update Payment
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        isVerified: action === "ACCEPT",
      },
    });

    // 4️⃣ Update Order: create new OrderHistory with updated status
    await prisma.$transaction([
      prisma.order.update({
        where: { id: payment.orderId },
        data: {
          orderHistories: {
            create: {
              status: orderStatus as any,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      message: `Payment ${action === "ACCEPT" ? "accepted" : "rejected"} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
