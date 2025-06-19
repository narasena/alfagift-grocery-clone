// import { prisma } from "../../prisma";
// import { AppError } from "../../utils/app.error";
// import { Request, Response, NextFunction } from "express";

// // belum selesai

// export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // const userId = req.user?.id;
//     const userId = req.body.userId;
//     const { shippingAddressId, storeId } = req.body;

//     if (!userId || !shippingAddressId || !storeId) {
//       throw new AppError("Missing required checkout fields", 400);
//     }

//     // 1. Fetch user's cart and active items
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         cartItems: {
//           where: {
//             status: "ACTIVE",
//             deletedAt: null,
//           },
//           include: {
//             productStock: {
//               include: {
//                 productDiscount: true,
//                 product: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!cart || cart.cartItems.length === 0) {
//       throw new AppError("No items in cart to checkout.", 400);
//     }

//     for (const item of cart.cartItems) {
//       if (item.quantity > item.productStock.stock) {
//         throw new AppError(`Insufficient stock for product ID ${item.productId}`, 400);
//       }
//     }
//     // 2. Build orderItems and total amount
//     const orderItemsData = cart.cartItems.map((item: any) => {
//       const originalPrice = item.productStock.price;
//       const discount = item.productStock.productDiscount;
//       const finalPrice = discount ? originalPrice * (1 - discount.percentage / 100) : originalPrice;

//       return {
//         productId: item.productId,
//         storeId,
//         quantity: item.quantity,
//         originalPrice,
//         finalPrice,
//         discountId: discount?.id ?? null,
//       };
//     });

//     const totalAmount = orderItemsData.reduce((sum: any, item: any) => {
//       return sum + item.finalPrice * item.quantity;
//     }, 0);

//     // 3. Create order and soft-delete cart items in transaction
//     await prisma.$transaction(async (tx) => {
//       await tx.order.create({
//         data: {
//           userId,
//           storeId,
//           shippingAddressId,
//           totalAmount,
//           orderItems: {
//             create: orderItemsData,
//           },
//         },
//       });

//       await tx.cartItem.updateMany({
//         where: {
//           cartId: cart.id,
//           deletedAt: null,
//           status: "ACTIVE",
//         },
//         data: {
//           deletedAt: new Date(),
//           status: "ORDERED",
//         },
//       });
//     });

//     res.status(201).json({
//       success: true,
//       message: "Order successfully created.",
//       data: null,
//     });
//   } catch (error) {
//     console.error("Checkout error:", error);

//     next(error);
//   }
// };
