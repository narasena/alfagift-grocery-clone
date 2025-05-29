import { prisma } from '../prisma';
import { ICloudinaryResult, IProduct, IProductImage } from '../types/product.type';
import { NextFunction, Request, Response } from 'express';
import {v2 as cloudinary} from 'cloudinary';


export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        price,
        productSubCategoryId,
        brandId,
        description,
        sku,
        barcode,
        weight,
        dimensions,
        images
      } = req.body;
      
      const slug = name.toLowerCase().replace(/\s+/g, '-');

      if (!name || !productSubCategoryId || !price || images.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Name, Price, Product Sub Category, and Product Images are required',
        });
      }

      const newProduct = await prisma.$transaction(async (tx) => {
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
        })
          
        const productId = product.id;

        const productImages = await tx.productImage.createMany({
          data: images.map((image: ICloudinaryResult) => ({
            productId,
            imageUrl: image.secure_url,
            cldPublicId: image.public_id,
            isMainImage: image.isMainImage,
          }))
        })
        return {product, productImages};
      })

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        newProduct
      });
    } catch (error) {
      next(error);
    }
  }

  async handleSignedupload(req: Request, res: Response, next: NextFunction) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      const { paramsToSign } = req.body;
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET as string
      )
      res.status(200).json({
        signature,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.product.findMany({
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
    } catch (error) {
      next(error);
    }
  }
}
