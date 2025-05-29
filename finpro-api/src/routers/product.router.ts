import { uploader } from '../middlewares/uploader.multer';
import { ProductController } from '../controllers/product.controller';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', uploader(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']).fields([{ name: 'images', maxCount: 3 }]), this.productController.createProduct);
    this.router.post('/signed-upload', this.productController.handleSignedupload)
    this.router.get('/all', this.productController.getProducts);
  }

  getRouter(): Router {
    return this.router;
  }
}
