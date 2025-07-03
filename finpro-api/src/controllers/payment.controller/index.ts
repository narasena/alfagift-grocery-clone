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
    const pendingPaymentHistories = await prisma.paymentHistory.findMany({
      where: {
        paymentStatus: "PENDING",
        payment: {
          paymentType: "BANK_TRANSFER",
        },
      },
      select: {
        payment: {
          select: {
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
                    id: true, // only need id to count
                  },
                },
              },
            },
          },
        },
      },
    });

    // transform results
    const result = pendingPaymentHistories.map((ph) => {
      const order = ph.payment?.order;
      return {
        firstName: order?.user.firstName,
        lastName: order?.user.lastName,
        numberOfProducts: order?.orderItems.length,
        totalAmount: order?.finalTotalAmount,
        orderId: order?.id,
      };
    });

    res.status(200).json({
      message: "Pending users fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, storeId, paymentStatus = "SUCCESS", reportType = "total", page = "1", limit = "10", search = "" } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = {
      payment: {
        paymentHistory: {
          some: {
            paymentStatus: paymentStatus as string,
          },
        },
      },
    };

    if (storeId) {
      whereClause.storeId = storeId as string;
    }

    if (month) {
      const monthNum = Number(month);
      const year = new Date().getFullYear();
      whereClause.createdAt = {
        gte: new Date(year, monthNum - 1, 1),
        lt: new Date(year, monthNum, 1),
      };
    }

    if (search) {
      whereClause.OR = [
        { store: { name: { contains: search as string, mode: "insensitive" } } },
        { orderItems: { some: { productStock: { product: { name: { contains: search as string, mode: "insensitive" } } } } } },
      ];
    }

    if (reportType === "total") {
      // Aggregated monthly sales
      const salesData = await prisma.order.groupBy({
        by: ["storeId"],
        where: whereClause,
        _sum: {
          finalTotalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      const salesReport = await Promise.all(
        salesData.map(async (sale) => {
          const store = await prisma.store.findUnique({
            where: { id: sale.storeId },
            select: { name: true },
          });
          
          return {
            id: `${sale.storeId}-${month || "all"}`,
            month: month ? new Date(2024, Number(month) - 1).toLocaleString("default", { month: "long" }) : "All",
            year: new Date().getFullYear(),
            totalSales: sale._sum.finalTotalAmount || 0,
            totalOrders: sale._count.id,
            storeName: store?.name,
          };
        })
      );

      res.status(200).json({
        message: "Sales report fetched successfully.",
        salesReport,
        salesReportLength: salesReport.length,
      });
    } else {
      // Individual transactions
      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          store: { select: { name: true } },
          payment: {
            include: {
              paymentHistory: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      });

      const totalCount = await prisma.order.count({ where: whereClause });

      const salesReport = orders.map((order) => ({
        orderId: order.id,
        orderDate: order.createdAt.toISOString(),
        totalAmount: order.finalTotalAmount,
        storeName: order.store.name,
        paymentStatus: order.payment?.paymentHistory[0]?.paymentStatus || "PENDING",
      }));

      res.status(200).json({
        message: "Sales report fetched successfully.",
        salesReport,
        salesReportLength: totalCount,
      });
    }
  } catch (error) {
    next(error);
  }
};
