import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";
import { $Enums } from "../../generated/prisma";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload; // Adjust based on your auth middleware
    const { shippingAddressId, storeId, voucherId } = req.body;

    if (!userId || !shippingAddressId || !storeId) {
      throw new AppError("Missing required checkout fields", 400);
    }

    // Get user's cart and active items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        cartItems: {
          where: {
            status: "ACTIVE",
            deletedAt: null,
            storeId, // only checkout for this store
          },
          select: {
            quantity: true,
            product: {
              select: {
                price: true,
                id: true,
                name: true,
                productStock: {
                  where: {
                    storeId,
                  },
                  select: {
                    stock: true,
                  },
                },
                productDiscountHistories: {
                  where: {
                    discount: {
                      startDate: { lte: new Date() },
                      endDate: { gte: new Date() },
                      storeDiscountHistories: {
                        some: {
                          storeId,
                        },
                      },
                    },
                  },
                  select: {
                    discountValue: true,
                    discount: {
                      select: {
                        id: true,
                        discountType: true,
                      },
                    },
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

    // Build order items + total
    let totalAmount = 0;

    const orderItemsData = cart.cartItems.map((item) => {
      const product = item.product;

      let discountValue = 0;
      if (product.productDiscountHistories.length > 0) {
        const discountType = product.productDiscountHistories[0]?.discount.discountType;
        if (discountType === $Enums.DiscountType.PERCENTAGE) {
          discountValue = product.price * ((product.productDiscountHistories[0]?.discountValue ?? 0) / 100);
        } else if (discountType === $Enums.DiscountType.FIXED_AMOUNT) {
          discountValue = product.productDiscountHistories[0]?.discountValue ?? 0;
        } else if (discountType === $Enums.DiscountType.BUY1_GET1) {
          const freeItems = Math.floor(item.quantity / 2);
          discountValue = product.price * freeItems;
        }
      }
      const originalPrice = product.price;
      const finalPrice = originalPrice - discountValue;

      if (item.quantity > item.product.productStock[0]?.stock) {
        throw new AppError(`Insufficient stock for product ${item.product.name}`, 400);
      }

      totalAmount += finalPrice * item.quantity;

      return {
        productId: item.product.id,
        storeId: storeId,
        quantity: item.quantity,
        originalPrice: originalPrice,
        discountedPrice: discountValue,
        finalPrice: finalPrice,
        discountId: item.product.productDiscountHistories[0]?.discount.id,
      };
    });

    // Example placeholder: replace with your logic
    const shippingCost = 0; // Example flat shipping fee in IDR
    const discountedShippingCost = 0; // Example shipping promo
    const baseTotalAmount = totalAmount; // e.g. sum of cart items
    let discountedTotalAmount = 0; // Example product discount

    let voucherAmountOff = 0;
    let voucherShippingOff = 0;
    let voucherApplied = false;
    if (voucherId) {
      const appliedVoucher = await prisma.voucher.findUnique({
        where: {
          id: voucherId,
        },
      });

      if (appliedVoucher) {
        if (appliedVoucher?.voucherType === $Enums.VoucherType.PRICE_CUT) {
          if (appliedVoucher?.discountValueType === $Enums.DiscountValueType.PERCENTAGE) {
            voucherAmountOff = ((appliedVoucher?.discountValue ?? 0) / 100) * baseTotalAmount;
          } else {
            voucherAmountOff = appliedVoucher?.discountValue ?? 0;
          }
        } else if (appliedVoucher?.voucherType === $Enums.VoucherType.REFERRAL) {
          voucherAmountOff = ((appliedVoucher?.discountValue ?? 0) / 100) * baseTotalAmount;
        } else if (appliedVoucher?.voucherType === $Enums.VoucherType.FREE_SHIPPING) {
          voucherShippingOff = appliedVoucher?.discountValue ?? 0;
        }
        voucherApplied = true;
      } else {
        throw new AppError("Voucher not found", 400);
      }
    }

    // Calculate final shipping cost (never negative)
    const finalShippingCost = Math.max(shippingCost - discountedShippingCost - voucherShippingOff, 0);

    // Calculate final amount: (products - discounts) + shipping
    const finalTotalAmount =
      Math.max(baseTotalAmount - discountedTotalAmount - voucherAmountOff, 0) + finalShippingCost;

    const activeMinPurchaseDiscount = await prisma.productDiscount.findFirst({
      where: {
        discountType: $Enums.DiscountType.MIN_PURCHASE,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
        OR: [
          {
            isGlobalStore: true, // Global discount applies to all stores
          },
          {
            storeDiscountHistories: {
              some: {
                storeId, // Store-specific discount
              },
            },
          },
        ],
      },
    });

    let nextShippingCostOffVouchers = 0;
    if (activeMinPurchaseDiscount) {
      const minPurchaseValue = activeMinPurchaseDiscount.minPurchaseValue ?? 0;
      if (baseTotalAmount >= minPurchaseValue) {
        nextShippingCostOffVouchers = Math.floor((baseTotalAmount - minPurchaseValue) / minPurchaseValue);
      }
    }
    // Transaction: create order, soft-delete cart items, update stock
    const createdOrderResult = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          storeId,
          shippingAddressId,
          totalAmount: baseTotalAmount,
          discountedTotalAmount,
          finalTotalAmount,
          shippingCost,
          discountedShippingCost,
          finalShippingCost,
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
              productId: item.product.id,
              storeId,
            },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
      if (voucherApplied || activeMinPurchaseDiscount) {
        let voucherUsage;
        let newVouchers;

        if (voucherApplied) {
          voucherUsage = await tx.voucherUsage.create({
            data: {
              voucherId,
              orderId: createdOrder.id,
              userId,
              discountedAmount: voucherAmountOff,
            },
          });
        }

        if (activeMinPurchaseDiscount) {
          newVouchers = await Promise.all(
            Array(nextShippingCostOffVouchers)
              .fill(0)
              .map(async () => {
                return await tx.voucher.create({
                  data: {
                    generatorOrderId: createdOrder.id,
                    name: `Gratis Ongkir Max. Rp 15.000`,
                    description: `Transaksi Order-${createdOrder.id} mendapatkan gratis ongkir max. Rp 15.000`,
                    discountId: activeMinPurchaseDiscount.id,
                    voucherType: $Enums.VoucherType.FREE_SHIPPING,
                    discountValueType: $Enums.DiscountValueType.FIXED_AMOUNT,
                    discountValue: 15000,
                    userId,
                    expiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                  },
                });
              }),
          );
        }

        return {
          ...createdOrder,
          ...(voucherUsage && { voucherUsage }),
          ...(newVouchers && { newVouchers }),
        };
      }

      return createdOrder;
    });

    res.status(201).json({
      success: true,
      message: "Order successfully created.",
      order: createdOrderResult,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    next(error);
  }
};

// display price breakdown
export const getOrderPriceBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload; // Adjust based on your auth middleware

    // Find the order with status WAITING_FOR_PAYMENT
    const order = await prisma.order.findFirst({
      where: {
        // id: orderId,
        userId,
        deletedAt: null,
        orderHistories: {
          some: {
            status: "WAITING_FOR_PAYMENT",
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Get the most recent order
      },
    });

    if (!order) {
      throw new AppError("Order not found or not in WAITING_FOR_PAYMENT", 404);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// fetch orderid and finaltotalamount
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { userId } = req.body.payload; // Adjust based on your auth middleware
    // if (!userId) {
    //   throw new AppError("User not authenticated.", 401);
    // }
    const { orderId } = req.params;

    if (!orderId) {
      throw new AppError("Order ID is required.", 400);
    }

    const orderById = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        finalTotalAmount: true,
      },
    });

    if (!orderById) {
      throw new AppError("Order not found.", 404);
    }

    res.status(200).json({
      success: true,
      orderById,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderHistoryByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.payload; // Adjust based on your auth middleware
    const { status } = req.query;

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    if (!status || typeof status !== "string") {
      throw new AppError("Status query parameter is required and must be a string.", 400);
    }
    const statusEnumValue = status?.toUpperCase() as $Enums.OrderStatus;

    const ordersByStatus = await prisma.order.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        createdAt: true,
        finalTotalAmount: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          select: { id: true }, // only need to count them
        },
        orderHistories: {
          where: {
            deletedAt: null,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    const filteredOrders = ordersByStatus.filter((order) => order.orderHistories[0]?.status === statusEnumValue);

    if (filteredOrders.length === 0) {
      throw new AppError("No orders found for the specified status.", 404);
    }

    const ordersWithDetails = filteredOrders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      numberOfProducts: order.orderItems.length,
      finalTotalAmount: order.finalTotalAmount,
      latestStatus: order.orderHistories[0]?.status || null,
    }));

    res.status(200).json({
      success: true,
      message: `Orders with status ${status} retrieved successfully.`,
      ordersWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError("Order ID is required.", 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        discountedTotalAmount: true,
        finalTotalAmount: true,
        shippingCost: true,
        discountedShippingCost: true,
        finalShippingCost: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        store: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        shippingAddress: {
          select: {
            address: true,
            subDistrict: true,
            district: true,
            city: true,
            province: true,
            postalCode: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            originalPrice: true,
            discountedPrice: true,
            finalPrice: true,
            productStock: {
              select: {
                productId: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    const shippingAddressFull = `${order.shippingAddress.address} ${order.shippingAddress.postalCode}`;

    res.status(200).json({
      orderId: order.id,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        originalPrice: item.originalPrice,
        discountedPrice: item.discountedPrice,
        finalPrice: item.finalPrice,
        productName: item.productStock.product.name,
      })),
      store: {
        name: order.store.name,
        phoneNumber: order.store.phoneNumber,
      },
      user: {
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        phoneNumber: order.user.phoneNumber,
      },
      shippingAddress: shippingAddressFull,
      totalAmount: order.totalAmount,
      totalDiscount: order.discountedTotalAmount,
      totalShippingCost: order.finalShippingCost,
      totalToBePaid: order.finalTotalAmount + order.finalShippingCost,
    });
  } catch (error) {
    next(error);
  }
};
