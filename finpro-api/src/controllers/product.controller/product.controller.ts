import { NextFunction, Request, Response } from "express";
import ProductService from "../../services/product/product.service";

export class ProductController {
  private productService = new ProductService();

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const newProduct = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const updatedProduct = await this.productService.updateProduct(slug, req.body);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        resultProduct: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.getProducts();
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, totalCount, totalPages, currentPage } = await this.productService.getAdminProducts(req.query);
      res.status(200).json({
        success: true,
        message: "Admin products fetched successfully",
        products,
        totalCount,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, storeId } = req.params;
      const product = await this.productService.getProductById(slug, storeId);
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, storeId } = req.params;
      const product = await this.productService.getProductBySlug(slug, storeId);
      if (!storeId) {
        res.status(200).json({
          success: true,
          message: "No store selected, product details might not be available",
          product,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Product fetched successfully",
          product,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
