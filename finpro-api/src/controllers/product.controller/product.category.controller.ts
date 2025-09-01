import ProductCategoryService from "@/services/product/product.category.service";
import { prisma } from "../../prisma";
import { Request, Response, NextFunction } from "express";

export class ProductCategoryController {
  private productCategoryService = new ProductCategoryService();
  public async getProductSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productSubCategories = await this.productCategoryService.getAllProductSubCategories();
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productSubCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProductCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productCategories = await this.productCategoryService.getAllProductCategories();
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const newProductCategory = await this.productCategoryService.createProductCategory(name);

      res.status(200).json({
        success: true,
        message: "Create product category is successfull",
        newProductCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProductSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, productCategoryId } = req.body;
      const newProductSubCategory = await this.productCategoryService.createProductSubCategory(name, productCategoryId);

      res.status(200).json({
        success: true,
        message: "Create product sub category is successfull",
        newProductSubCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async findProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, storeId } = req.params;
      const { page = "1", limit = "10" } = req.query;

      const { category, products, totalProducts, totalPages, currentPage } =
        await this.productCategoryService.findProductCategory(
          { slug, storeId },
          { page: String(page), limit: String(limit) },
        );

      res.status(200).json({
        success: true,
        message: "Get data successfull",
        category,
        products,
        totalProducts,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }
}
