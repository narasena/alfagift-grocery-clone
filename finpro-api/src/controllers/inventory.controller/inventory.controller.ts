import { NextFunction, Request, Response } from "express";
import InventoryService from "@/services/inventory/inventory.service";

const inventoryService = new InventoryService();

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stocks, total, page, totalPages } = await inventoryService.getAllStocks(req.query);
    res.status(200).json({
      success: true,
      message: "Stocks fetched successfully",
      stocks,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockByProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const productStocks = await inventoryService.getStockByProductId(slug);
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
    const { storeStocks, storeName } = await inventoryService.getStockByStoreId(storeId);
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
    const productStockDetail = await inventoryService.getProductStockDetail(slug, storeId);
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
    const updateResult = await inventoryService.updateProductStockDetail(slug, storeId, req.body);
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
    const updateResult = await inventoryService.updateProductStocksByStore(storeId, toBeUpdatedStocks);

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
    const { stocksReport, stocksReportLength } = await inventoryService.getStocksReport(req.query);
    res.status(200).json({
      success: true,
      message: "Stocks report generated successfully",
      stocksReport,
      stocksReportLength,
    });
  } catch (error) {
    next(error);
  }
};

export const checkStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, storeId, quantity } = req.body;
    const { isAvailable, currentStock, requestedQuantity } = await inventoryService.checkStock(productId, storeId, quantity);

    res.status(200).json({
      success: true,
      isAvailable,
      currentStock,
      requestedQuantity,
    });
  } catch (error) {
    next(error);
  }
};
