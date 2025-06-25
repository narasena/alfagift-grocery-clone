import { prisma } from "../../prisma";
import { ICloudinaryResult, IProductImage } from "../../types/product.type";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";
import { EditProductImageService } from "../../services/product.service/product.image.service";

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, productSubCategoryId, brandId, description, sku, barcode, weight, dimensions, images } =
        req.body;

      const slug = name.toLowerCase().replace(/\s+/g, "-");

      if (!name || !productSubCategoryId || !price || images.length === 0) {
        res.status(400).json({
          success: false,
          message: "Name, Price, Product Sub Category, and Product Images are required",
        });
      }

      const newProduct = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const product = await tx.product.create({
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

        const productImages = await tx.productImage.createMany({
          data: images.map((image: ICloudinaryResult) => ({
            productId,
            imageUrl: image.secure_url,
            cldPublicId: image.public_id,
            isMainImage: image.isMainImage,
          })),
        });
        return { product, productImages };
      });

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
      const {
        name,
        price,
        newSlug,
        productSubCategoryId,
        brandId,
        description,
        sku,
        barcode,
        weight,
        dimensions,
        editedExistingImages,
        newUploads,
      } = req.body;

      if (!name || !productSubCategoryId || !price) {
        res.status(400).json({
          success: false,
          message: "Name, Price, and Product Sub Category are required",
        });
      }
      if (!Array.isArray(editedExistingImages) || !Array.isArray(newUploads)) {
        res.status(400).json({
          success: false,
          message: "editedExistingImages and newUploads should be arrays",
        });
      }
      if (editedExistingImages.length === 0 && newUploads.length === 0) {
        res.status(400).json({
          success: false,
          message: "editedExistingImages and newUploads should not be empty",
        });
      }

      const product = await prisma.product.findUnique({
        where: {
          slug,
        },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      const productId = product?.id;

      // Slug conflict: only if slug changed
      if (newSlug && newSlug !== slug) {
        const existing = await prisma.product.findUnique({ where: { slug: newSlug } });
        if (existing && existing.id !== productId) {
           res.status(400).json({
            success: false,
            message: "Product slug already exists, please try changing the name a bit.",
          });
        }
      }

      const existingName = product?.name;
      const existingProductImages: IProductImage[] = (await prisma.productImage.findMany({
        where: {
          productId: product?.id,
        },
      })) as IProductImage[];

      const transactionResult = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const updatedProduct = await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            name,
            slug: newSlug,
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

        const productImageService = new EditProductImageService(
          existingProductImages,
          editedExistingImages,
          newUploads,
        );

        const toDelete = productImageService.getImagesToDelete();
        if (toDelete.length > 0) {
          await tx.productImage.updateMany({
            where: {
              productId,
              cldPublicId: { in: toDelete.map((img) => img.cldPublicId) },
              deletedAt: null,
            },
            data: { deletedAt: new Date() },
          });
        }

        const { oldMain, newMain } = productImageService.getMainImageChange();
        if (newMain) {
          // Unset old main
          await tx.productImage.updateMany({
            where: {
              productId,
              isMainImage: true,
              deletedAt: null,
            },
            data: { isMainImage: false },
          });
          // Set new main
          await tx.productImage.update({
            where: {
              id: newMain.id,
            },
            data: { isMainImage: true },
          });
        }

        if (productImageService.isOrderChanged()) {
          for (let i = 0; i < editedExistingImages.length; i++) {
            const editedImg = editedExistingImages[i];
            await tx.productImage.update({
              where: { id: editedImg.id },
              data: {},
            });
          }
        }

        const newImages = productImageService.getNewUploads();
        if (newImages.length > 0) {
          const createdData = newImages.map((img: ICloudinaryResult) => ({
            productId,
            cldPublicId: img.public_id,
            imageUrl: img.secure_url,
          }));
        }

        const mainImageFromNewUploads = productImageService.mainImageFromNewUploads;
        if (mainImageFromNewUploads) {
          await tx.productImage.updateMany({
            where: {
              productId,
              isMainImage: true,
              deletedAt: null,
            },
            data: { isMainImage: false },
          });

          await tx.productImage.updateMany({
            where: {
              productId,
              cldPublicId: mainImageFromNewUploads.public_id,
            },
            data: { isMainImage: true },
          });
        }
        return updatedProduct;
      });

      const resultProduct = await prisma.product.findUnique({
        where: { slug: newSlug },
        include: {
          productImage: {
            where: { deletedAt: null },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        resultProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          productImage: {
            where:{deletedAt: null}
          },
          productSubCategory: {
            include: {
              productCategory: true,
            }
            
          },
          productBrand: {where: {deletedAt: null}},
        },
      });
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const product = await prisma.product.findUnique({
        where: {
          slug,
        },
        include: {
          productImage: {
            where: {
              deletedAt: null,
            },
            orderBy: [
              {isMainImage: 'desc'},
              {updatedAt: 'desc'}
            ]
          },
          productSubCategory: {
            include: {
              productCategory: true,
            },
          },
          productBrand: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
}
