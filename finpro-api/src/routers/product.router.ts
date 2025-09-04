import { uploader } from "../middlewares/uploader.multer";
import { ProductController } from "../controllers/product.controller/product.controller";
import { Router } from "express";

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/create",
      uploader(["image/jpeg", "image/png", "image/jpg", "image/webp"]).fields([{ name: "images", maxCount: 3 }]),
      this.productController.createProduct.bind(this.productController),
    );
    this.router.get("/all", this.productController.getProducts.bind(this.productController));
    this.router.get("/admin/list", this.productController.getAdminProducts.bind(this.productController));
    this.router.get("/details/:slug/:storeId", this.productController.getProductBySlug.bind(this.productController));
    this.router.put("/edit/:slug", this.productController.updateProduct.bind(this.productController));
  }

  getRouter(): Router {
    return this.router;
  }
}
