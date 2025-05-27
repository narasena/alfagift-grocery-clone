import { uploadImage } from '../lib/cloudinary';
import { prisma } from '../prisma';
import { IProduct } from '../types/product.type';
import { NextFunction, Request, Response } from 'express';
import {v2 as cloudinary} from 'cloudinary';

interface ICloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction){
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
      } = req.body;
      
      let files: Express.Multer.File[] | undefined
      let imagesUploaded: string[] = []
      if (req.files) {
        files = Array.isArray(req.files) ? req.files : req.files['images']
        
        const uploadOptions = {
          folder: `products/${productSubCategoryId}`
        }

        imagesUploaded = []
        for (const image of files!) {
          const result = await uploadImage(image.buffer, uploadOptions) as ICloudinaryResponse
          if(result && result.secure_url){
            imagesUploaded.push(result.secure_url)
          }
        }
      }

      const slug = name.toLowerCase().replace(/\s+/g, '-');

      if (!name || !productSubCategoryId || !price ) {
        res.status(400).json({
          success: false,
          message: 'Name, Price and Product Sub Category are required',
        });
      }

      // const product = await prisma.$transaction(async (tx) => {
      //   const product = await tx.product.create({
      //     data: {
      //       name,
      //       slug,
      //       price,
      //       productSubCategoryId,
      //       brandId,
      //       description,
      //       sku,
      //       barcode,
      //       weight,
      //       dimensions,
      //     },
      //   })
          
      //   const productId = await tx.product.findUnique({
      //     where: {
      //       slug
      //     }
      //   })

      //   const productImages = await tx.productImage.createMany({

      //   })
      // })

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        // product,
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
}
