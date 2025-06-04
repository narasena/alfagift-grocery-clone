import { prisma } from '../prisma';
import { Request, Response, NextFunction } from 'express';

export class ProductCategoryController {
  async getProductSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productSubCategories = await prisma.productSubCategory.findMany();
      res.status(200).json({
        success: true,
        message: 'Get data successfull',
        productSubCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productCategories = await prisma.productCategory.findMany();
      res.status(200).json({
        success: true,
        message: 'Get data successfull',
        productCategories,
      });
    } catch (error) {
      next(error);
    }
  }
}
