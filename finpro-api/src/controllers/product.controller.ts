import { NextFunction, Request, Response } from "express";

export class ProductController {
    async createProduct(req:Request, res:Response, next:NextFunction) {
        try {
            const { name, description, price, categoryId } = req.body;
            const productImage = req.file;

            if (!name || !description || !price || !categoryId || !productImage) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            // Assuming uploadImage is a function that uploads the image and returns the URL
            const imageUrl = await uploadImage(productImage.buffer);

            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    categoryId,
                    imageUrl
                }
            });

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                product
            });
        } catch (error) {
            next(error);
        }
    }
 }