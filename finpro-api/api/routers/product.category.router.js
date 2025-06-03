"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryRouter = void 0;
const product_category_controller_1 = require("../controllers/product.category.controller");
const express_1 = require("express");
class ProductCategoryRouter {
    constructor() {
        this.productCategoryController = new product_category_controller_1.ProductCategoryController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.productCategoryController.getProductCategories);
        this.router.get('/subcategories', this.productCategoryController.getProductSubCategories);
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductCategoryRouter = ProductCategoryRouter;
