import { ProductCategoryController } from "@/controllers/product.controller/product.category.controller";
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
    this.router.get("/", this.productCategoryController.getProductCategories.bind(this.productCategoryController));
    this.router.get("/subcategories", this.productCategoryController.getProductSubCategories.bind(this.productCategoryController));
    this.router.post("/create", this.productCategoryController.createProductCategory.bind(this.productCategoryController));
    this.router.post("/subcategories/create", this.productCategoryController.createProductSubCategory.bind(this.productCategoryController));
    this.router.get('/find/:slug/:storeId', this.productCategoryController.findProductCategory.bind(this.productCategoryController));
  }

  getRouter(): Router {
    return this.router;
  }
}
