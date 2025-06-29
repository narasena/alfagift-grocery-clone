import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";

// belum selesai

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
