import { prisma } from "../../prisma";
import nameToSlug from "../../utils/nameToSlug";
import { ICloudinaryResult, IProductImage } from "../../types/product.type";
import { Prisma } from "@prisma/client";
import { EditProductImageService } from "./product.image.service";

export default class ProductService {
  async createProduct(payload: {
    name: string;
    price: number;
    productSubCategoryId: string;
    brandId: string;
    description: string;
    sku: string;
    barcode: string;
    weight: number;
    dimensions: string;
    images: ICloudinaryResult[];
  }) {
    const { name, price, productSubCategoryId, brandId, description, sku, barcode, weight, dimensions, images } = payload;

    const slug = nameToSlug(name);

    if (!name || !productSubCategoryId || !price || images.length === 0) {
      throw {
        isExpose: true,
        status: 400,
        success: false,
        message: "Name, Price, Product Sub Category, and Product Images are required",
      };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug, deletedAt: null },
    });

    if (existingProduct) {
      throw { isExpose: true, status: 400, success: false, message: "Product with this name already exists" };
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

      const storesIds = await tx.store.findMany({ where: { deletedAt: null }, select: { id: true } });

      const productStocks = await tx.productStock.createMany({
        data: storesIds.map((store: { id: string }) => ({
          productId,
          storeId: store.id,
          stock: 0,
        })),
      });

      return { product, productImages, productStocks };
    });
    return newProduct;
  }

  async updateProduct(slug: string, payload: {
    name: string;
    price: number;
    newSlug: string;
    productSubCategoryId: string;
    brandId: string;
    description: string;
    sku: string;
    barcode: string;
    weight: number;
    dimensions: string;
    editedExistingImages: IProductImage[];
    newUploads: ICloudinaryResult[];
  }) {
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
    } = payload;

    if (!name || !productSubCategoryId || !price) {
      throw {
        isExpose: true,
        status: 400,
        success: false,
        message: "Name, Price, and Product Sub Category are required",
      };
    }
    if (!Array.isArray(editedExistingImages) || !Array.isArray(newUploads)) {
      throw {
        isExpose: true,
        status: 400,
        success: false,
        message: "editedExistingImages and newUploads should be arrays",
      };
    }
    if (editedExistingImages.length + newUploads.length === 0) {
      throw {
        isExpose: true,
        status: 400,
        success: false,
        message: "Product must have at least one image",
      };
    }

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (!product) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
    }
    const productId = product?.id;

    // Slug conflict: only if slug changed
    if (newSlug && newSlug !== slug) {
      const existing = await prisma.product.findUnique({ where: { slug: newSlug } });
      if (existing && existing.id !== productId) {
        throw {
          isExpose: true,
          status: 400,
          success: false,
          message: "Product slug already exists, please try changing the name a bit.",
        };
      }
    }

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
        await tx.productImage.createMany({ data: createdData });
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
    return resultProduct;
  }

  async getProducts() {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        productImage: {
          where: { deletedAt: null },
        },
        productSubCategory: {
          include: {
            productCategory: true,
          },
        },
        productBrand: { where: { deletedAt: null } },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return products;
  }

  async getAdminProducts(query: {
    search?: string;
    categoryId?: string;
    subCategoryId?: string;
    page?: string;
    limit?: string;
  }) {
    const { search = "", categoryId = "", subCategoryId = "", page = "1", limit = "10" } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = {
      deletedAt: null,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
        { barcode: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (subCategoryId) {
      whereClause.productSubCategoryId = Number(subCategoryId);
    } else if (categoryId) {
      whereClause.productSubCategory = {
        productCategoryId: Number(categoryId),
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          productImage: {
            where: { deletedAt: null },
          },
          productSubCategory: {
            include: {
              productCategory: true,
            },
          },
          productBrand: { where: { deletedAt: null } },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
      products,
      totalCount,
      totalPages,
      currentPage: Number(page),
    };
  }

  async getProductById(slug: string, storeId: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        productImage: {
          where: {
            deletedAt: null,
          },
          orderBy: [{ isMainImage: "desc" }, { updatedAt: "desc" }],
        },
        productSubCategory: {
          include: {
            productCategory: true,
          },
        },
        productBrand: true,
      },
    });
    if (!product) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
    }
    const stock = (
      await prisma.productStock.findUnique({
        where: {
          productId_storeId: {
            productId: product?.id!,
            storeId,
          },
          deletedAt: null,
        },
      })
    )?.stock;

    const activeDiscount = await prisma.productDiscount.findFirst({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
    const activeProductDiscount = await prisma.productDiscountHistory.findFirst({
      where: {
        productId: product?.id!,
        discountId: activeDiscount?.id,
      },
    });
    const activeStoreDiscount = await prisma.storeDiscountHistory.findFirst({
      where: {
        storeId,
        discountId: activeDiscount?.id,
      },
    });

    let discount: {} | null = {};

    if (activeDiscount && activeProductDiscount && activeStoreDiscount) {
      const _discountValue = activeProductDiscount?.discountValue;
      let _discountedPrice = product?.price!;

      if (activeDiscount?.discountType === "PERCENTAGE" && _discountValue) {
        _discountedPrice = product?.price! - (product?.price! * _discountValue) / 100;
      } else if (activeDiscount?.discountType === "FIXED_AMOUNT" && _discountValue) {
        _discountedPrice = product?.price! - _discountValue;
      }

      discount = {
        name: activeDiscount?.name,
        description: activeDiscount?.description,
        type: activeDiscount?.discountType,
        discountValue: activeDiscount?.discountType === "BUY1_GET1" ? null : _discountValue,
        discountedPrice: activeDiscount?.discountType === "BUY1_GET1" ? null : _discountedPrice,
      };
    } else {
      discount = null;
    }

    return { ...product, stock, discount };
  }

  async getProductBySlug(slug: string, storeId: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        description: true,
        productSubCategory: {
          select: {
            name: true,
            slug: true,
            productCategory: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        productImage: {
          take: 1,
          where: { isMainImage: true },
          select: {
            imageUrl: true,
          },
        },
        ...(storeId && {
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
              discount: {
                select: {
                  discountType: true,
                },
              },
            },
          },
        }),
      },
    });
    if (!product) {
      throw {
        isExpose: true,
        status: 404,
        success: false,
        message: "Product not found",
      };
    }
    return product;
  }
}
