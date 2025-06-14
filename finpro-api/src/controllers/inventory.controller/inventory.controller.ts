import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stocks = await prisma.productStock.findMany({
      where: {
        deletedAt: null,
        product: {
          deletedAt: null,
        },
        store: { deletedAt: null },
      },
      include: {
        product: {
          include: {
            productImage: {
              where: { deletedAt: null },
              orderBy: [{ isMainImage: "desc" }, { updatedAt: "desc" }],
            },
          },
        },
        store: true,
      },
    });
  console.log(stocks.length)
  res.status(200).json({
    success: true,
    message: "Stocks fetched successfully",
    stocks,
  })
  } catch (error) {
    next(error);
  }
};

export const getStockByProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const productId = (await prisma.product.findUnique({
      where:{slug}
    }))?.id
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    const productStocks = await prisma.productStock.findMany({
      where: {
        productId,
        product: {
          deletedAt: null,
        },
        deletedAt: null,
        store: { deletedAt: null },
      },
      include: {
        store: true,
        product: {
          include: {
            productImage: {
              where: { deletedAt: null },
              orderBy: [{ isMainImage: "desc" }, { updatedAt: "desc" }],
            },
          },
        }
      }
    })
    res.status(200).json({
      success: true,
      message: "Product stocks fetched successfully",
      productStocks,
    })
    
  } catch (error) {
    next(error);
    
  }
}
