import { prisma } from "../../prisma";
import { AppError } from "../../utils/app.error";
import { Request, Response, NextFunction } from "express";
//create cart items to add items to the cart
//get cart items

// delete cart items
// delete all cart items

// update? the qty backend or frontend?
// calculate the total price backend or frontend?

// checkout

export const createCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cari userId dulu
    // userId ambil dari req.body buat sementara

    // const userId = req.user?.id; // Adjust based on your auth middleware
    const userId = req.body.userId;
    const { productId, storeId, quantity } = req.body;

    if (!userId || !productId || !storeId || !quantity || quantity < 1) {
      //   return res.status(400).json({ message: "Invalid input data." });
      throw new AppError("Invalid input data.", 400);
    }

    // Check product stock (assuming product is unique per store)
    const productStock = await prisma.productStock.findFirst({
      where: {
        productId,
        storeId,
      },
    });

    if (!productStock) {
      throw new AppError("Product not found.", 404);
    }

    if (productStock.stock < quantity) {
      throw new AppError("Insufficient stock for this product.", 400);
    }

    // 1. Check if cart by that user already exists
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // 2. Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    // 3. Check if item already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        storeId,
      },
    });

    if (existingCartItem) {
      // 4a. Update existing item quantity
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // 4b. Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          storeId,
          quantity,
        },
      });
    }

    res.status(200).json({ success: true, message: "Item successfully added to cart.", data: null });
  } catch (error) {
    console.error("Cart item creation failed:", error);
    next(error);
  }
};

export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cari userId dulu
    // const userId = req.user?.id; // Adjust based on your auth middleware
    const userId = req.body.userId;

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    // Find the cart for the user
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        cartItems: {
          where: {
            status: "ACTIVE",
          },
          include: {
            productStock: {
              include: {
                product: {
                  include: {
                    productImage: {
                      where: { isMainImage: true },
                      take: 1,
                    },
                    productBrand: true,
                    productSubCategory: {
                      include: {
                        productCategory: true,
                      },
                    },
                    productDiscount: {
                      where: {
                        isActive: true,
                        startDate: { lte: new Date() },
                        endDate: { gte: new Date() },
                      },
                    },
                  },
                },
                store: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new AppError("Cart not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully.",
      data: cart.cartItems,
    });
  } catch (error) {
    next(error);
  }
};

// export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;
//     const cartItemId = req.params.cartItemId; // assuming DELETE /cart/item/:cartItemId

//     if (!userId) {
//       throw new AppError("User not authenticated.", 401);
//     }

//     if (!cartItemId) {
//       throw new AppError("Cart item ID is required.", 400);
//     }

//     // Get the user's cart
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//     });

//     if (!cart) {
//       throw new AppError("Cart not found.", 404);
//     }

//     // Check if the cart item exists and belongs to this cart
//     const cartItem = await prisma.cartItem.findUnique({
//       where: { id: cartItemId },
//     });

//     if (!cartItem || cartItem.cartId !== cart.id) {
//       throw new AppError("Cart item not found or unauthorized.", 404);
//     }

//     // Soft delete: update deletedAt and optionally status
//     await prisma.cartItem.update({
//       where: { id: cartItemId },
//       data: {
//         deletedAt: new Date(),
//         status: "REMOVED", // optional: mark as inactive
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Cart item soft-deleted successfully.",
//       data: null,
//     });
//   } catch (error) {
//     console.error("Soft delete failed:", error);
//     next(error);
//   }
// };

// export const deleteAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       throw new AppError("User not authenticated.", 401);
//     }

//     // Get the user's cart
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//     });

//     if (!cart) {
//       throw new AppError("Cart not found.", 404);
//     }

//     // Soft delete all active & non-deleted cart items
//     await prisma.cartItem.updateMany({
//       where: {
//         cartId: cart.id,
//         deletedAt: null,
//         status: "ACTIVE",
//       },
//       data: {
//         deletedAt: new Date(),
//         status: "REMOVED", // Optional: change status to inactive
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "All cart items soft-deleted successfully.",
//       data: null,
//     });
//   } catch (error) {
//     console.error("Failed to soft-delete all cart items:", error);
//     next(error);
//   }
// };
