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

  async createProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body
      if (!name || name === "") {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Category name is required",
        };
      }

      const existingCategoryNames = await prisma.productCategory.findMany({
        select: { name: true },
      });

      if (existingCategoryNames.some((category) => category.name === name)) {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Category name already exists",
        };
      }

      const newSlug = name.toLowerCase().replace(/\s+/g, "-");

      const newProductCategory = await prisma.productCategory.create({
        data: {
          name,
          slug: newSlug,
        },
      })

      res.status(200).json({
        success: true,
        message: "Create data successfull",
        newProductCategory,
      });
    } catch (error) {
      next(error);
    }
  }
}
