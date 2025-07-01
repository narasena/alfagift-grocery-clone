import { prisma } from "../../prisma";
import { Request, Response, NextFunction } from "express";

export class ProductCategoryController {
  async getProductSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productSubCategories = await prisma.productSubCategory.findMany();
      if (productSubCategories.length === 0) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productSubCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const productCategories = await prisma.productCategory.findMany();
      if (productCategories.length === 0) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }
      res.status(200).json({
        success: true,
        message: "Get data successfull",
        productCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name || name === "") {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Category name is required",
        };
      }

      const existingCategoryNames = await prisma.productCategory.findMany({
        select: { name: true },
      });

      if (existingCategoryNames.some((category) => category.name === name)) {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Category name already exists",
        };
      }

      const newSlug = name.toLowerCase().replace(/\s+/g, "-");

      const newProductCategory = await prisma.productCategory.create({
        data: {
          name,
          slug: newSlug,
        },
      });

      res.status(200).json({
        success: true,
        message: "Create product category is successfull",
        newProductCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProductSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, productCategoryId } = req.body;
      console.log(name, productCategoryId);
      if (!name || name === "" || !productCategoryId || productCategoryId === "") {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "All fields are required",
        };
      }
      const existingSubCategoryNames = await prisma.productSubCategory.findMany({
        where: {
          productCategoryId,
        },
        select: { name: true },
      });
      if (existingSubCategoryNames.some((category) => category.name === name)) {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Sub Category name already exist in the category",
        };
      }

      const newSlug = name.toLowerCase().replace(/\s+/g, "-");

      const newProductSubCategory = await prisma.productSubCategory.create({
        data: {
          name,
          slug: newSlug,
          productCategoryId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Create product sub category is successfull",
        newProductSubCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async findProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug,storeId } = req.params
      
      const category = await prisma.productCategory.findUnique({
        where: {
          slug,
        },
        select: {
          name: true,
          slug: true,
          productSubCategory: {
            select: {
              name: true,
              slug: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  description: true,
                  productImage: {
                    take: 1,
                    where: { isMainImage: true },
                    select: {
                      imageUrl: true,
                    },
                  },
                  productStock: {
                    where: {
                      storeId,
                    },
                    select: {
                      stock: true,
                    },
                  },
                  productDiscountHistories: {
                    where: {
                      discount: {
                        startDate: {
                          lte: new Date(),
                        },
                        endDate: {
                          gte: new Date(),
                        },
                        storeDiscountHistories: {
                          some: {
                            storeId,
                          },
                        },
                        
                      },
                    }, select: {
                      discountValue: true
                    }
                  },
                },
              },
            },
          },
        },
      });

      const subCategory = await prisma.productSubCategory.findUnique({
        where: {
          slug,
        },
        select: {
          name: true,
          slug: true,
          productCategory: {
            select: {
              name: true,
              slug: true,
            },
          },
          product: {
            select: {
              id: true, 
              name: true,
              slug: true,
              price: true,
              description: true,
              productImage: {
                take: 1,  
                where: { isMainImage: true },
                select: {
                  imageUrl: true,
                },
              },
              productStock: {
                where: {
                  storeId,
                },
                select: {
                  stock: true,
                },
              },
              productDiscountHistories: {
                where: {
                  discount: {
                    startDate: {
                      lte: new Date(),
                    },
                    endDate: {
                      gte: new Date(),
                    },
                    storeDiscountHistories: {
                      some: {
                        storeId,
                      },
                    },
                  },
                },
                select: {
                  discountValue: true,
                },
              },
            },
          },
        },
      });

      if(!category && !subCategory) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }

      const result = category || subCategory

      res.status(200).json({
        success: true,
        message: "Get data successfull",
        category: result
      });

    } catch (error) {
      next(error);
    }
  }
}
