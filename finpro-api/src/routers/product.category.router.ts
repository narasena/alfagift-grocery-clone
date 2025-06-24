import { ProductCategoryController } from "../controllers/product.controller/product.category.controller";
import { Router } from "express";

export class ProductCategoryRouter {
  private router: Router;
  private productCategoryController: ProductCategoryController;

  constructor() {
    this.productCategoryController = new ProductCategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.productCategoryController.getProductCategories);
    this.router.get("/subcategories", this.productCategoryController.getProductSubCategories);
  }

  getRouter(): Router {
    return this.router;
  }
}
