import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload; // Adjust based on your auth middleware
    const { shippingAddressId, storeId } = req.body;

    if (!userId || !shippingAddressId || !storeId) {
      throw new AppError("Missing required checkout fields", 400);
    }

    // Get user's cart and active items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          where: {
            status: "ACTIVE",
            deletedAt: null,
            storeId, // only checkout for this store
          },
          include: {
            productStock: {
              include: {
                product: {
                  include: {
                    productDiscountHistories: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new AppError("No items in cart for this store to checkout.", 400);
    }

    // Get currently active discounts
    const activeDiscounts = await prisma.productDiscount.findMany({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    const activeDiscountIds = activeDiscounts.map((discount) => discount.id);

    // Build order items + total
    let totalAmount = 0;

    const orderItemsData = cart.cartItems.map((item) => {
      const product = item.productStock.product;

      const activeDiscountHistory = product.productDiscountHistories.find((history) =>
        activeDiscountIds.includes(history.discountId),
      );

      const discountValue = activeDiscountHistory?.discountValue ?? 0;
      const originalPrice = product.price;
      const finalPrice = originalPrice - discountValue;

      if (item.quantity > item.productStock.stock) {
        throw new AppError(`Insufficient stock for product ID ${item.productId}`, 400);
      }

      totalAmount += finalPrice * item.quantity;

      return {
        productId: item.productId,
        storeId: storeId,
        quantity: item.quantity,
        originalPrice: originalPrice,
        discountedPrice: finalPrice,
        finalPrice: finalPrice,
        discountId: activeDiscountHistory?.discountId ?? null,
      };
    });

    // Shipping cost placeholder — replace with real logic
    const shippingCost = 50_000;
    const discountedShippingCost = shippingCost; // add logic if needed
    const finalTotalAmount = totalAmount + discountedShippingCost;

    // Transaction: create order, soft-delete cart items, update stock
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          storeId,
          shippingAddressId,
          totalAmount,
          discountedTotalAmount: totalAmount,
          finalTotalAmount,
          shippingCost,
          discountedShippingCost,
          finalShippingCost: discountedShippingCost,
          orderItems: {
            create: orderItemsData,
          },
          orderHistories: {
            create: {
              status: "WAITING_FOR_PAYMENT",
            },
          },
        },
      });

      await tx.cartItem.updateMany({
        where: {
          cartId: cart.id,
          storeId,
          status: "ACTIVE",
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          status: "ORDERED",
        },
      });

      for (const item of cart.cartItems) {
        await tx.productStock.update({
          where: {
            productId_storeId: {
              productId: item.productId,
              storeId: item.storeId,
            },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return createdOrder;
    });

    res.status(201).json({
      success: true,
      message: "Order successfully created.",
      data: order,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    next(error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload;

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    // Fetch all orders for the authenticated user
    const orders = await prisma.order.findMany({
      where: {
        userId,
        deletedAt: null, // Only active orders
      },
      include: {
        orderItems: {
          include: {
            productStock: {
              select: {
                product: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
            productDiscount: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                productDiscountHistories: {
                  select: {
                    discountValue: true,
                  },
                },
              },
            },
          },
        },
        store: {
          select: {
            name: true,
          },
        },
        shippingAddress: true,
        payment: true,
      },
    });

    if (!orders || orders.length === 0) {
      throw new AppError("No orders found.", 404);
    }

    // Format the order items (optional, but clearer for client)
    const ordersWithDetails = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        originalPrice: item.originalPrice,
        discountedPrice: item.discountedPrice,
        finalPrice: item.finalPrice,
        productName: item.productStock.product.name,
        productBasePrice: item.productStock.product.price,
        discount: item.productDiscount
          ? {
              id: item.productDiscount.id,
              value: item.productDiscount.productDiscountHistories[0]?.discountValue || 0,
              startDate: item.productDiscount.startDate,
              endDate: item.productDiscount.endDate,
            }
          : null,
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      ordersWithDetails,
    });
  } catch (error) {
    next(error);
  }
};
