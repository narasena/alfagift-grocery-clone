import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../prisma";
import { NextFunction, Request, Response } from "express";
import { EStockMovementType, IProductStock, IProductStockHistory, IProductStockHistoryForm } from "@/types/product.stock.type";

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ProductStockWhereInput = {
      deletedAt: null,
      product: {
        deletedAt: null,
        ...(search && {
          name: {
            contains: search as string,
            mode: 'insensitive'
          }
        })
      },
      store: { deletedAt: null },
    };

    const [stocks, total] = await Promise.all([
      prisma.productStock.findMany({
        where,
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
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take: limitNum,
      }),
      prisma.productStock.count({ where })
    ]);

    res.status(200).json({
      success: true,
      message: "Stocks fetched successfully",
      stocks,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
};

export const getStockByProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const productId = (
      await prisma.product.findUnique({
        where: { slug },
      })
    )?.id;
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Product stocks fetched successfully",
      productStocks,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockByStoreId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params;
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!storeId) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    const storeName = store?.name;
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
      storeName,
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
    const productId = product.id;
    const productStockDetail = await prisma.productStock.findUnique({
      where: {
        productId_storeId: {
          productId,
          storeId,
        },
        deletedAt: null,
        product: {
          deletedAt: null,
          productSubCategory: {
            deletedAt: null,
            productCategory: {
              deletedAt: null,
            },
          },
          OR: [{ productBrand: null }, { productBrand: { deletedAt: null } }],
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
      },
    });
    res.status(200).json({
      success: true,
      message: "Product stock detail fetched successfully",
      productStockDetail,
    });
  } catch (error) {
    next(error);
  }
};

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
    const productId = product.id;

    const updateResult = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const stockHistory = await tx.productStockHistory.create({
        data: {
          productId,
          storeId,
          quantity: Number(quantity),
          type,
          reference,
          notes,
        },
      });

      const currentStock = await tx.productStock.findUnique({
        where: {
          productId_storeId: {
            productId,
            storeId,
          },
          deletedAt: null,
        },
      });

      let newStockQuantity = currentStock?.stock || 0;

      switch (type) {
        case "STORE_IN":
          newStockQuantity += Number(quantity);
          break;
        case "STORE_OUT":
          newStockQuantity -= Number(quantity);
          break;
        case "SALE":
          newStockQuantity -= Number(quantity);
          break;
        case "ADJUSTMENT":
          newStockQuantity += Number(quantity);
          break;
      }

      const updatedStock = await tx.productStock.update({
        where: {
          productId_storeId: {
            productId,
            storeId,
          },
          deletedAt: null,
        },
        data: {
          stock: newStockQuantity,
        },
      });
      return { stockHistory, updatedStock };
    });
    res.status(200).json({
      success: true,
      message: "Product stock detail updated successfully",
      updateResult,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductStocksByStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params;
    const { toBeUpdatedStocks } = req.body;
    if (!storeId) {
      res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }
    if (toBeUpdatedStocks.length === 0) {
      res.status(400).json({
        success: false,
        message: "No stock to be updated",
      });
    }
    const updateResult = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const stockHistory = await tx.productStockHistory.createMany({
        data: toBeUpdatedStocks.map((stock: IProductStockHistory) => ({
          productId: stock.productId,
          storeId,
          quantity: Number(stock.quantity),
          type: stock.type,
          reference: stock.reference,
          notes: stock.notes,
        })),
      });

      const currentStocks = await tx.productStock.findMany({
        where: {
          productId: {
            in: toBeUpdatedStocks.map((stock: IProductStockHistory) => stock.productId),
          },
          storeId,
          deletedAt: null,
        },
      });

      const updatedStocks = await Promise.all(
        toBeUpdatedStocks.map(async (stock: IProductStockHistory) => {
          const currentStock = currentStocks.find((cs: IProductStock) => cs.productId === stock.productId);
          let newStockQuantity = currentStock?.stock || 0;

          switch (stock.type) {
            case "STORE_IN":
              newStockQuantity += Number(stock.quantity);
              break;
            case "STORE_OUT":
              newStockQuantity -= Number(stock.quantity);
              break;
            case "SALE":
              newStockQuantity -= Number(stock.quantity);
              break;
            case "ADJUSTMENT":
              newStockQuantity += Number(stock.quantity);
              break;
          }

          return tx.productStock.update({
            where: {
              productId_storeId: {
                productId: stock.productId,
                storeId,
              },
              deletedAt: null,
            },
            data: {
              stock: newStockQuantity,
            },
          });
        }),
      );
      return { stockHistory, updatedStocks };
    });

    res.status(200).json({
      success: true,
      message: "Product stocks updated successfully",
      updateResult,
    });
  } catch (error) {
    next(error);
  }
};

export const getStocksReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportType,month, storeId, type, page, limit, sortOrder, search } = req.query;
    console.log(req.query);
    if(reportType === 'total') {
      
      const where: Prisma.ProductStockWhereInput = { deletedAt: null };
      
      if (month) {
        const year = new Date().getFullYear();
        const monthNum = parseInt(month as string);
        where.createdAt = {
          gte: new Date(year, monthNum - 1, 1),
          lte: new Date(year, monthNum, 0), // Last day of the month
        };
      }
      
      if (storeId) {
        where.storeId = String(storeId);
      }
  
      if (type) {
        where.stockHistory = {}
      }
          
      if (search) {
        where.product = {
          name: {
            contains: String(search),
            mode: 'insensitive'
          }
        }
      }
      const stocksReportLength = await prisma.productStock.count({
        where
      })
      
      const stocksReport = await prisma.productStock.findMany({
        where,
        include:{
          product: { select: { name: true } },
          store: { select: { name: true } }
        },
          
        orderBy: {
          createdAt: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      })
      const stocksReportQuantity = await prisma.productStockHistory.groupBy({
        by: [ 'productId','storeId', 'type'],
        where:{storeId: storeId as string},
        _sum: {
          quantity: true,
        },
        orderBy: {
          productId:'asc'
        }
      });
      
      const transformedStocksReport = stocksReport.map((stock) => {
        const storeInMatch = stocksReportQuantity.find(
          (qty) => qty.productId === stock.productId && qty.storeId === stock.storeId && qty.type === "STORE_IN",
        );
        const storeOutMatch = stocksReportQuantity.find(
          (qty) => qty.productId === stock.productId && qty.storeId === stock.storeId && qty.type === "STORE_OUT",
        );
        return {
          ...stock,
          storeInQuantity: storeInMatch ? storeInMatch._sum.quantity : 0,
          storeOutQuantity: storeOutMatch ? storeOutMatch._sum.quantity : 0,
        };
      });
      
      res.status(200).json({
        success: true,
        message: "Stocks report generated successfully",
        stocksReport:transformedStocksReport,
        stocksReportLength
      });
    }else if (reportType === 'monthly') {
      const where: Prisma.ProductStockHistoryWhereInput = { deletedAt: null };
      
      if (month) {
        const year = new Date().getFullYear();
        const monthNum = parseInt(month as string);
        where.createdAt = {
          gte: new Date(year, monthNum - 1, 1),
          lte: new Date(year, monthNum, 0), // Last day of the month
        };
      }
      
      if (storeId) {
        where.storeId = String(storeId);
      }
      
      if (search) {
        if (where.productStock) {
          where.productStock.product = {
            name: {
              contains: String(search),
              mode: 'insensitive'
            }
          }
        }
      }

      if (type) {
        where.type = type as EStockMovementType
      }

      const stocksReportLength = await prisma.productStockHistory.count({
        where
      })
      
      const stocksReport = await prisma.productStockHistory.findMany({
        where,
        include: {
          productStock: {
            select: {
              product: { select: { name: true } },
              store: { select: { name: true } }
            }
          }
        },
        orderBy: {
          createdAt: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        // skip: (Number(page) - 1) * Number(limit),
        // take: Number(limit),
      });
      res.status(200).json({
        success: true,
        message: "Stocks report generated successfully",
        stocksReport,
        stocksReportLength
      });
        
    }
  } catch (error) {
    next(error);
  }
};