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
    this.router.post("/create", this.productCategoryController.createProductCategory);
    this.router.post("/subcategories/create", this.productCategoryController.createProductSubCategory);
    this.router.get('/find/:slug/:storeId', this.productCategoryController.findProductCategory);
  }

  getRouter(): Router {
    return this.router;
  }
}
