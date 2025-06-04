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
exports.ProductController = void 0;
const prisma_1 = require("../prisma");
const cloudinary_1 = require("cloudinary");
class ProductController {
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, productSubCategoryId, brandId, description, sku, barcode, weight, dimensions, images } = req.body;
                const slug = name.toLowerCase().replace(/\s+/g, '-');
                if (!name || !productSubCategoryId || !price || images.length === 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Name, Price, Product Sub Category, and Product Images are required',
                    });
                }
                const newProduct = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield tx.product.create({
                        data: {
                            name,
                            slug,
                            price,
                            productSubCategoryId,
                            brandId,
                            description,
                            sku,
                            barcode,
                            weight,
                            dimensions,
                        },
                    });
                    const productId = product.id;
                    const productImages = yield tx.productImage.createMany({
                        data: images.map((image) => ({
                            productId,
                            imageUrl: image.secure_url,
                            cldPublicId: image.public_id,
                            isMainImage: image.isMainImage,
                        }))
                    });
                    return { product, productImages };
                }));
                res.status(201).json({
                    success: true,
                    message: 'Product created successfully',
                    newProduct
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    handleSignedupload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                cloudinary_1.v2.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    secure: true,
                });
                const { paramsToSign } = req.body;
                const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
                res.status(200).json({
                    signature,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield prisma_1.prisma.product.findMany({
                    include: {
                        productImage: true,
                        productSubCategory: {
                            include: {
                                productCategory: true
                            }
                        },
                        productBrand: true,
                    }
                });
                res.status(200).json({
                    success: true,
                    message: 'Products fetched successfully',
                    products
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const product = yield prisma_1.prisma.product.findUnique({
                    where: {
                        slug,
                    },
                    include: {
                        productImage: true,
                        productSubCategory: {
                            include: {
                                productCategory: true
                            }
                        },
                        productBrand: true,
                    }
                });
                res.status(200).json({
                    success: true,
                    message: 'Product fetched successfully',
                    product
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
