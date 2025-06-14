import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stocks = await prisma.productStock.findMany({
      where: {
        deletedAt: null,
        product: {
          deletedAt: null,
          productSubCategory: {
            deletedAt: null,
            productCategory: {
              deletedAt: null,
            },
          },
          OR: [
            {productBrand: null},
            {productBrand: {deletedAt: null}}
          ]
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
            productSubCategory: {
              include: {
                productCategory: true
              }
            },
            productBrand: true
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
