"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const uploader_multer_1 = require("../middlewares/uploader.multer");
const product_controller_1 = require("../controllers/product.controller");
const express_1 = require("express");
class ProductRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productController = new product_controller_1.ProductController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/create', (0, uploader_multer_1.uploader)(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']).fields([{ name: 'images', maxCount: 3 }]), this.productController.createProduct);
        this.router.post('/signed-upload', this.productController.handleSignedupload);
        this.router.get('/all', this.productController.getProducts);
        this.router.get('/:slug', this.productController.getProductById);
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductRouter = ProductRouter;
