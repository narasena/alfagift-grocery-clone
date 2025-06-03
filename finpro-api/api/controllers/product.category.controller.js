"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryController = void 0;
const prisma_1 = require("../prisma");
class ProductCategoryController {
    getProductSubCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productSubCategories = yield prisma_1.prisma.productSubCategory.findMany();
                res.status(200).json({
                    success: true,
                    message: 'Get data successfull',
                    productSubCategories,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProductCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productCategories = yield prisma_1.prisma.productCategory.findMany();
                res.status(200).json({
                    success: true,
                    message: 'Get data successfull',
                    productCategories,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductCategoryController = ProductCategoryController;
