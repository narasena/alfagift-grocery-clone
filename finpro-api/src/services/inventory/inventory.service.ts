import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../prisma";
import {
  EStockMovementType,
  IProductStock,
  IProductStockHistory,
  IProductStockHistoryForm,
} from "../../types/product.stock.type";

export default class InventoryService {
  async getAllStocks(query: { page?: string; limit?: string; search?: string; storeId?: string }) {
    const { page = 1, limit = 10, search, storeId } = query;
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
            mode: "insensitive",
          },
        }),
      },
      store: { deletedAt: null },
      ...(storeId && { storeId: storeId as string }),
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
          updatedAt: "desc",
        },
        skip,
        take: limitNum,
      }),
      prisma.productStock.count({ where }),
    ]);

    return {
      stocks,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async getStockByProductId(slug: string) {
    const productId = (
      await prisma.product.findUnique({
        where: { slug },
      })
    )?.id;
    if (!productId) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
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
    return productStocks;
  }

  async getStockByStoreId(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!storeId) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Store not found",
      };
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
    return { storeStocks, storeName };
  }

  async getProductStockDetail(slug: string, storeId: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!product) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
    }
    if (!store) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Store not found",
      };
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
    return productStockDetail;
  }

  async updateProductStockDetail(
    slug: string,
    storeId: string,
    payload: {
      quantity: number;
      type: EStockMovementType;
      reference: string;
      notes: string;
    },
  ) {
    const { quantity, type, reference, notes } = payload;
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!product) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
    }
    if (!store) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Store not found",
      };
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
          newStockQuantity = Math.max(0, newStockQuantity - Number(quantity));
          break;
        case "SALE":
          newStockQuantity = Math.max(0, newStockQuantity - Number(quantity));
          break;
        case "ADJUSTMENT":
          newStockQuantity += Number(quantity);
          break;
      }

      if (newStockQuantity < 0) {
        throw new Error("Insufficient stock for this operation");
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
    return updateResult;
  }

  async updateProductStocksByStore(storeId: string, toBeUpdatedStocks: IProductStockHistory[]) {
    if (!storeId) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Store not found",
      };
    }
    if (toBeUpdatedStocks.length === 0) {
      throw {
        isExpose: true,
        status: 400,
        success: false,
        message: "No stock to be updated",
      };
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
          productId: { in: toBeUpdatedStocks.map((stock: IProductStockHistory) => stock.productId) },
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
              newStockQuantity = Math.max(0, newStockQuantity - Number(stock.quantity));
              break;
            case "SALE":
              newStockQuantity = Math.max(0, newStockQuantity - Number(stock.quantity));
              break;
            case "ADJUSTMENT":
              newStockQuantity += Number(stock.quantity);
              break;
          }

          if (newStockQuantity < 0) {
            throw new Error(`Insufficient stock for product ${stock.productId}`);
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
    return updateResult;
  }

  async getStocksReport(query: {
    reportType?: string;
    month?: string;
    storeId?: string;
    type?: EStockMovementType;
    page?: string;
    limit?: string;
    sortOrder?: string;
    search?: string;
  }) {
    const { reportType, month, storeId, type, page, limit, sortOrder, search } = query;

    if (reportType === "total") {
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
        where.stockHistory = {};
      }

      if (search) {
        where.product = {
          name: {
            contains: String(search),
            mode: "insensitive",
          },
        };
      }
      const stocksReportLength = await prisma.productStock.count({
        where,
      });

      const stocksReport = await prisma.productStock.findMany({
        where,
        include: {
          product: { select: { name: true } },
          store: { select: { name: true } },
        },

        orderBy: {
          createdAt: sortOrder === "asc" ? "asc" : "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
      const stocksReportQuantity = await prisma.productStockHistory.groupBy({
        by: ["productId", "storeId", "type"],
        where: { storeId: storeId as string },
        _sum: {
          quantity: true,
        },
        orderBy: {
          productId: "asc",
        },
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

      return {
        stocksReport: transformedStocksReport,
        stocksReportLength,
      };
    } else if (reportType === "monthly") {
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
              mode: "insensitive",
            },
          };
        }
      }

      if (type) {
        where.type = type as EStockMovementType;
      }

      const stocksReportLength = await prisma.productStockHistory.count({
        where,
      });

      const stocksReport = await prisma.productStockHistory.findMany({
        where,
        include: {
          productStock: {
            select: {
              product: { select: { name: true } },
              store: { select: { name: true } },
            },
          },
        },
        orderBy: {
          createdAt: sortOrder === "asc" ? "asc" : "desc",
        },
        // skip: (Number(page) - 1) * Number(limit),
        // take: Number(limit),
      });
      return {
        stocksReport,
        stocksReportLength,
      };
    }
    return {}; // Should not reach here, but to satisfy return type
  }

  async checkStock(productId: string, storeId: string, quantity: number) {
    const productStock = await prisma.productStock.findUnique({
      where: {
        productId_storeId: {
          productId,
          storeId,
        },
        deletedAt: null,
      },
    });

    if (!productStock) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product stock not found",
      };
    }

    const isAvailable = productStock.stock >= quantity;

    return {
      isAvailable,
      currentStock: productStock.stock,
      requestedQuantity: quantity,
    };
  }
}
