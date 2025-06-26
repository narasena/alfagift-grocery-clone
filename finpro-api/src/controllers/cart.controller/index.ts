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
    // const userId = req.body.userId;

    const { userId } = req.body.payload; // Adjust based on your auth middleware
    const { productId, quantity } = req.body; //storeId
    const { storeId } = req.params; // Assuming storeId is passed as a URL parameter

    if (!userId || !productId || !storeId || !quantity || quantity < 1) {
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
        status: "ACTIVE", // Ensure we only consider active items
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
          status: "ACTIVE", // Set status to ACTIVE
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
    // const userId = req.body.userId

    const { userId } = req.body.payload;
    console.log(req.body.payload);

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
                    productDiscountHistories: {
                      include: {
                        discount: true,
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

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new AppError("No items in the cart.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully.",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req.user?.id;
    // const userId = req.body.userId;
    const { userId } = req.body.payload;

    const cartItemId = req.params.cartItemId; // assuming DELETE /cart/item/:cartItemId

    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    if (!cartItemId) {
      throw new AppError("Cart item ID is required.", 400);
    }

    // Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError("Cart not found.", 404);
    }

    // Check if the cart item exists and belongs to this cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new AppError("Cart item not found or unauthorized.", 404);
    }

    if (cartItem.deletedAt) {
      throw new AppError("Cart item already deleted.", 400);
    }

    // Soft delete: update deletedAt and optionally status
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        deletedAt: new Date(),
        status: "REMOVED", // optional: mark as inactive
      },
    });

    res.status(200).json({
      success: true,
      message: "Cart item soft-deleted successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Soft delete failed:", error);
    next(error);
  }
};

export const deleteAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req.user?.id;
    // const userId = req.body.userId;

    const { userId } = req.body.payload;
    if (!userId) {
      throw new AppError("User not authenticated.", 401);
    }

    // Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError("Cart not found.", 404);
    }

    // Soft delete all active & non-deleted cart items
    await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        deletedAt: null,
        status: "ACTIVE",
      },
      data: {
        deletedAt: new Date(),
        status: "REMOVED", // Optional: change status to inactive
      },
    });

    res.status(200).json({
      success: true,
      message: "All cart items soft-deleted successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Failed to soft-delete all cart items:", error);
    next(error);
  }
};

//belum
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req.body.userId; // Or req.user?.id if using auth middleware
    const { userId } = req.body.payload;
    const cartItemId = req.params.cartItemId; // assuming PUT /cart/item/:cartItemId/update-qty
    let { quantity } = req.body;
    quantity = parseInt(quantity);

    // error di sini gabisa update qty
    if (!userId || !cartItemId || typeof quantity !== "number") {
      throw new AppError("Invalid input data.", 400);
    }

    const currentProductStock = await prisma.productStock.findUnique({
      where: {
        productId_storeId: {
          productId: req.body.productId, // Assuming productId is passed in the body
          storeId: req.body.storeId, // Assuming storeId is passed in the body
        },
      },
    });

    // ngecek stock dgn store id product id
    const currentStock = currentProductStock?.stock || 0;

    if (currentStock === 0) {
      throw new AppError("Product is out of stock.", 400);
    }

    if (quantity < currentStock) {
      throw new AppError("Requested quantity exceeds available stock.", 400);
    }

    // cek harga

    if (quantity < 1) {
      throw new AppError("Quantity must be at least 1.", 400);
    }

    // Make sure the cart item belongs to the user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId,
        },
        status: "ACTIVE", // Ensure we only update active items
      },
    });

    if (!existingCartItem) {
      throw new AppError("Cart item not found or does not belong to this user.", 404);
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully.",
      updatedCartItem,
    });
  } catch (error) {
    next(error);
  }
};
