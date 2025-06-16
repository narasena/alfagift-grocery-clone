import { Prisma } from "@prisma/client";
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

export const getStockByStoreId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params;
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })
    if (!storeId) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    const storeName = store?.name
    const storeStocks = await prisma.productStock.findMany({
      where: {
        storeId,
        product: {
          deletedAt: null,
        },
        deletedAt: null,
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
      },
    });
    res.status(200).json({
      success: true,
      message: "Product stocks fetched successfully",
      storeStocks,
      storeName
    });
  } catch (error) {
    next(error);
  }
};

export const getProductStockDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, storeId } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    const productId = product.id
    const productStockDetail = await prisma.productStock.findUnique({
      where: {
        productId_storeId: {
          productId,
          storeId
        },
        deletedAt: null,
        product: {
          deletedAt: null,
          productSubCategory: {
            deletedAt: null,
            productCategory: {
              deletedAt: null
            }
          },
          OR: [
            { productBrand: null },
            { productBrand: { deletedAt: null } },
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
                productCategory: true,
              },
            },
            productBrand: true,
          },
        },
        store: true,
        stockHistory: { 
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      }
    })
    res.status(200).json({
      success: true,
      message: "Product stock detail fetched successfully",
      productStockDetail
    });
  } catch (error) {
    next(error);    
  }
}

export const updateProductStockDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, storeId } = req.params;
    const { quantity, type, reference, notes } = req.body;
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    const productId = product.id

    const updateResult  = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const stockHistory = await tx.productStockHistory.create({
        data: {
          productId,
          storeId,
          quantity: Number(quantity),
          type,
          reference,
          notes
        }
      })

      const currentStock = await tx.productStock.findUnique({
        where: {
          productId_storeId: {
            productId,
            storeId
          },
          deletedAt: null,
        }
      })

      let newStockQuantity = currentStock?.stock || 0

      switch (type) {
        case 'STORE_IN':
          newStockQuantity += Number(quantity)
          break;
        case 'STORE_OUT':
          newStockQuantity -= Number(quantity)
          break;
        case 'SALE':
          newStockQuantity -= Number(quantity)
          break;
        case 'ADJUSTMENT':
          newStockQuantity += Number(quantity)
          break;
      }

      const updatedStock = await tx.productStock.update({
        where: {
          productId_storeId: {
            productId,
            storeId
          },
          deletedAt: null,
        },
        data: {
          stock: newStockQuantity
        }
      })
      return { stockHistory, updatedStock }
    })
    res.status(200).json({
      success: true,
      message: "Product stock detail updated successfully",
      updateResult
    });
  
  } catch (error) {
    next(error);
    
  }
}