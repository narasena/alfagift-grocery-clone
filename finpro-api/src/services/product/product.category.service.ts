import { prisma } from "../../prisma";
import nameToSlug from "../../utils/nameToSlug";

export default class ProductCategoryService {
  private async findData(model: any) {
    try {
      const data = await model.findMany();
      if (data.length === 0) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async getAllProductCategories() {
    return this.findData(prisma.productCategory);
  }

  public async getAllProductSubCategories() {
    return this.findData(prisma.productSubCategory);
  }

  public async createProductCategory(name: string) {
    try {
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

      const newSlug = nameToSlug(name);

      const newProductCategory = await prisma.productCategory.create({
        data: {
          name,
          slug: newSlug,
        },
      });
      return newProductCategory;
    } catch (error) {
      throw error;
    }
  }

  public async createProductSubCategory(name: string, productCategoryId: string) {
    try {
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
          productCategoryId: Number(productCategoryId),
        },
        select: { name: true },
      });
      if (existingSubCategoryNames.some((category) => category.name === name)) {
        throw {
          isExpose: true,
          success: false,
          status: 400,
          message: "Sub Category name already exists",
        };
      }

      const newSlug = nameToSlug(name);

      const newProductSubCategory = await prisma.productSubCategory.create({
        data: {
          name,
          slug: newSlug,
          productCategoryId: Number(productCategoryId),
        },
      });
      return newProductSubCategory;
    } catch (error) {
      throw error;
    }
  }

  public async findProductCategory(params: { slug: string; storeId: string }, query: { page: string; limit: string }) {
    try {
      const page = Number(query.page || "1");
      const limit = Number(query.limit || "10");
      const { slug, storeId } = params;
      const skip = Number(page) * Number(limit);
      const take = Number(limit);
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
                  discount: {
                    select: { discountType: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!category && !subCategory) {
        throw {
          isExpose: true,
          success: false,
          status: 404,
          message: "Data not found",
        };
      }

      const result = category || subCategory;

      // Get paginated products and total count
      let products: any[] = [];
      let totalProducts = 0;

      if (category) {
        // For category, get products from all subcategories with pagination
        const allProducts = await prisma.product.findMany({
          where: {
            productSubCategory: {
              productCategoryId: category
                ? await prisma.productCategory
                    .findUnique({
                      where: { slug },
                      select: { id: true },
                    })
                    .then((cat) => cat?.id)
                : undefined,
            },
            productStock: {
              some: { storeId },
            },
          },
          skip,
          take,
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
                discount: {
                  select: {
                    discountType: true,
                  },
                },
              },
            },
          },
        });

        products = allProducts;
        totalProducts = await prisma.product.count({
          where: {
            productSubCategory: {
              productCategoryId: await prisma.productCategory
                .findUnique({
                  where: { slug },
                  select: { id: true },
                })
                .then((cat) => cat?.id),
            },
            productStock: {
              some: { storeId },
            },
          },
        });
      } else if (subCategory) {
        // For subcategory, get products directly with pagination
        products = await prisma.product.findMany({
          where: {
            productSubCategory: {
              slug,
            },
            productStock: {
              some: { storeId },
            },
          },
          skip,
          take,
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
                discount: {
                  select: {
                    discountType: true,
                  },
                },
              },
            },
          },
        });

        totalProducts = await prisma.product.count({
          where: {
            productSubCategory: {
              slug,
            },
            productStock: {
              some: { storeId },
            },
          },
        });
      }

      const totalPages = Math.ceil(totalProducts / Number(limit));
      return {
        category: result,
        products,
        totalPages,
        totalProducts,
        currentPage: Number(page),
      };
    } catch (error) {
      throw error;
    }
  }
}
