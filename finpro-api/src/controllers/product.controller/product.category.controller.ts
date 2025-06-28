import { prisma } from "../../prisma";
import { Request, Response, NextFunction } from "express";

export class ProductCategoryController {
  async getProductSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productSubCategories = await prisma.productSubCategory.findMany();
      if (productSubCategories.length === 0) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productSubCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productCategories = await prisma.productCategory.findMany();
      if (productCategories.length === 0) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProductCategory(req: Request, res: Response, next: NextFunction) {}
}
