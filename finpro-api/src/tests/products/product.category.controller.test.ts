import request from "supertest";
import App from "../../app";
import { Express } from "express";
import { prismaMock } from "../setup";
import describeEndPoint from "@/utils/tests/describeEndPoint";

const API_PATHS = {
  GET_PRODUCT_CATEGORIES: "/api/product-category",
  GET_PRODUCT_SUB_CATEGORIES: "/api/product-category/subcategories",
  CREATE_PRODUCT_CATEGORY: "/api/product-category/create",
  CREATE_PRODUCT_SUB_CATEGORY: "/api/product-category/subcategories/create",
  FIND_PRODUCT_CATEGORY: "/api/product-category/find/:slug/:storeId",
};

describe("ProductCategoryController - Unit Test", () => {
  let app: Express;

  beforeAll(() => {
    const application = new App();
    app = application.getApp();
  });

  describe(describeEndPoint("GET", API_PATHS.GET_PRODUCT_CATEGORIES), () => {
    it("should fetch all product categories", async () => {
      const mockProductCategories = [
        {
          id: 1,
          name: "Category 1",
          slug: "category-1",
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: "Category 2",
          slug: "category-2",
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      prismaMock.productCategory.findMany.mockResolvedValue(mockProductCategories);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_CATEGORIES);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.productCategories)).toBe(true);
      expect(response.body.productCategories.length).toBe(mockProductCategories.length);
    });

    it("should handle no data found", async () => {
      prismaMock.productCategory.findMany.mockResolvedValue([]);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_CATEGORIES);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(Array.isArray(response.body.productCategories)).toBe(false);
    });

    it("should handle errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");

      prismaMock.productCategory.findMany.mockRejectedValue(mockError);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_CATEGORIES);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });

  describe(describeEndPoint("GET", API_PATHS.GET_PRODUCT_SUB_CATEGORIES), () => {
    it("should fetch all product subcategories", async () => {
      const mockProductSubCategories = [
        {
          id: 1,
          name: "Subcategory 1",
          slug: "subcategory-1",
          productCategoryId: 1,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: "Subcategory 2",
          slug: "subcategory-2",
          productCategoryId: 2,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      prismaMock.productSubCategory.findMany.mockResolvedValue(mockProductSubCategories);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_SUB_CATEGORIES);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.productSubCategories)).toBe(true);
      expect(response.body.productSubCategories.length).toBe(mockProductSubCategories.length);
    });
    it("should handle no data found", async () => {
      prismaMock.productSubCategory.findMany.mockResolvedValue([]);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_SUB_CATEGORIES);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Data not found");
      expect(Array.isArray(response.body.productSubCategories)).toBe(false);
    });

    it("should handle errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");

      prismaMock.productSubCategory.findMany.mockRejectedValue(mockError);

      const response = await request(app).get(API_PATHS.GET_PRODUCT_SUB_CATEGORIES);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });

  describe(describeEndPoint("POST", API_PATHS.CREATE_PRODUCT_CATEGORY), () => {
    const mockCreatedProductCategory = {
      id: 1,
      name: "Category 1",
      slug: "category-1",
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    it("should create a new product category", async () => {
      prismaMock.productCategory.create.mockResolvedValue(mockCreatedProductCategory);
      prismaMock.productCategory.findMany.mockResolvedValue([]);

      const response = await request(app)
        .post(API_PATHS.CREATE_PRODUCT_CATEGORY)
        .send({ name: mockCreatedProductCategory.name });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Create product category is successful");
      expect(Object.keys(response.body.newProductCategory)).toEqual(Object.keys(mockCreatedProductCategory));
      expect({
        ...response.body.newProductCategory,
        createdAt: new Date(response.body.newProductCategory.createdAt),
        updatedAt: new Date(response.body.newProductCategory.updatedAt),
      }).toEqual(mockCreatedProductCategory);
    });

    it("should handle missing required body parameters", async () => {
      const response = await request(app).post(API_PATHS.CREATE_PRODUCT_CATEGORY).send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Category name is required");
    });

    it("should handled existing category name", async () => {
      prismaMock.productCategory.findMany.mockResolvedValue([mockCreatedProductCategory]);
      const response = await request(app)
        .post(API_PATHS.CREATE_PRODUCT_CATEGORY)
        .send({ name: mockCreatedProductCategory.name });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch("Category name already exists");
    });

    it("should handle errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");

      prismaMock.productCategory.create.mockRejectedValue(mockError);

      const response = await request(app)
        .post(API_PATHS.CREATE_PRODUCT_CATEGORY)
        .send({ name: mockCreatedProductCategory.name });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });

  describe(describeEndPoint("POST", API_PATHS.CREATE_PRODUCT_SUB_CATEGORY), () => {
    const mockCreatedProductSubCategory = {
      id: 1,
      name: "Sub Category 1",
      slug: "sub-category-1",
      productCategoryId: 1,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    it("should create a new product category", async () => {
      prismaMock.productSubCategory.create.mockResolvedValue(mockCreatedProductSubCategory);
      prismaMock.productSubCategory.findMany.mockResolvedValue([]);

      const response = await request(app).post(API_PATHS.CREATE_PRODUCT_SUB_CATEGORY).send({
        name: mockCreatedProductSubCategory.name,
        productCategoryId: mockCreatedProductSubCategory.productCategoryId,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Create product sub category is successful");
      expect(Object.keys(response.body.newProductSubCategory)).toEqual(Object.keys(mockCreatedProductSubCategory));
      expect({
        ...response.body.newProductSubCategory,
        createdAt: new Date(response.body.newProductSubCategory.createdAt),
        updatedAt: new Date(response.body.newProductSubCategory.updatedAt),
      }).toEqual(mockCreatedProductSubCategory);
    });

    const scenarios = [
      { name: undefined, productCategoryId: "123" },
      { name: "", productCategoryId: "123" },
      { name: "Test Sub Category", productCategoryId: undefined },
      { name: "Test Sub Category", productCategoryId: "" },
      { name: undefined, productCategoryId: undefined },
      { name: "", productCategoryId: "" },
    ];

    scenarios.forEach((scenario) => {
      it(`should throw error when ${JSON.stringify(scenario)}`, async () => {
        const response = await request(app).post(API_PATHS.CREATE_PRODUCT_SUB_CATEGORY).send(scenario);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("All fields are required");
      });
    });

    it("should handled existing sub category name", async () => {
      prismaMock.productSubCategory.findMany.mockResolvedValue([mockCreatedProductSubCategory]);
      const response = await request(app).post(API_PATHS.CREATE_PRODUCT_SUB_CATEGORY).send({
        name: mockCreatedProductSubCategory.name,
        productCategoryId: mockCreatedProductSubCategory.productCategoryId,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch("Sub Category name already exists");
    });

    it("should handle errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");

      prismaMock.productSubCategory.create.mockRejectedValue(mockError);

      const response = await request(app).post(API_PATHS.CREATE_PRODUCT_SUB_CATEGORY).send({
        name: mockCreatedProductSubCategory.name,
        productCategoryId: mockCreatedProductSubCategory.productCategoryId,
      });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });

  describe(describeEndPoint("GET", API_PATHS.FIND_PRODUCT_CATEGORY), () => {
    const mockSlug = "category-1";
    const mockStoreId = "1";
    const mockTotalProducts = 2;
    const mockTotalPages = 1;
    const mockCurrentPage = 1;

    const mockCategory = {
      name: "Category 1",
      slug: "category-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      productSubCategory: [
        {
          name: "Subcategory 1",
          slug: "subcategory-1",
          product: [
            {
              id: "product1",
              name: "Product 1",
              slug: "product-1",
              price: 11000,
              description: "Product 1 description",
              productImage: [{ imageUrl: "image1.jpg", isMainImage: true }],
              productStock: [{ stock: 101 }],
              productDiscountHistories: [{ discountValue: 1100, discount: { discountType: "FIXED_AMOUNT" } }],
            },
            {
              id: "product2",
              name: "Product 2",
              slug: "product-2",
              price: 12000,
              description: "Product 2 description",
              productImage: [{ imageUrl: "image2.jpg", isMainImage: true }],
              productStock: [{ stock: 102 }],
              productDiscountHistories: [{ discountValue: 10, discount: { discountType: "PERCENTAGE" } }],
            },
          ],
        },
      ],
    };

    const mockSubCategory = {
      name: "Subcategory 1",
      slug: "subcategory-1",
      productCategory: { name: "Category 1", slug: "category-1" },
      product: [
        {
          id: "product1",
          name: "Product 1",
          slug: "product-1",
          price: 11000,
          description: "Product 1 description",
          productImage: [{ imageUrl: "image1.jpg", isMainImage: true }],
          productStock: [{ stock: 101 }],
          productDiscountHistories: [{ discountValue: 1100, discount: { discountType: "FIXED_AMOUNT" } }],
        },
        {
          id: "product2",
          name: "Product 2",
          slug: "product-2",
          price: 12000,
          description: "Product 2 description",
          productImage: [{ imageUrl: "image2.jpg", isMainImage: true }],
          productStock: [{ stock: 102 }],
          productDiscountHistories: [{ discountValue: 10, discount: { discountType: "PERCENTAGE" } }],
        },
      ],
    };

    const mockProducts = mockCategory.productSubCategory[0].product;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should find a product category and its products successfully", async () => {
      prismaMock.productCategory.findUnique.mockResolvedValue(mockCategory as any);
      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);
      prismaMock.product.count.mockResolvedValue(mockTotalProducts);

      const response = await request(app).get(
        API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", mockStoreId),
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Get data successfully");
      expect(response.body.category).toEqual(expect.objectContaining({
        name: mockCategory.name,
        slug: mockCategory.slug,
        productSubCategory: expect.any(Array),
      }));
      expect(response.body.products).toEqual(mockProducts);
      expect(response.body.totalProducts).toBe(mockTotalProducts);
      expect(response.body.totalPages).toBe(mockTotalPages);
      expect(response.body.currentPage).toBe(mockCurrentPage);
    });

    it("should find a product subcategory and its products successfully", async () => {
      prismaMock.productCategory.findUnique.mockResolvedValue(null);
      prismaMock.productSubCategory.findUnique.mockResolvedValue(mockSubCategory as any);
      prismaMock.product.findMany.mockResolvedValue(mockSubCategory.product as any);
      prismaMock.product.count.mockResolvedValue(mockTotalProducts);

      const response = await request(app).get(
        API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", "subcategory-1").replace(":storeId", mockStoreId),
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Get data successfully");
      expect(response.body.category).toEqual({
        name: mockSubCategory.name,
        slug: mockSubCategory.slug,
        productCategory: expect.any(Object),
        product: expect.any(Array),
      });
      expect(response.body.products).toEqual(mockSubCategory.product);
      expect(response.body.totalProducts).toBe(mockTotalProducts);
      expect(response.body.totalPages).toBe(mockTotalPages);
      expect(response.body.currentPage).toBe(mockCurrentPage);
    });

    it("should handle category and subcategory not found", async () => {
      prismaMock.productCategory.findUnique.mockResolvedValue(null);
      prismaMock.productSubCategory.findUnique.mockResolvedValue(null);

      const response = await request(app).get(
        API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", mockStoreId),
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Data not found");
    });

    it("should handle pagination correctly with valid query parameters", async () => {
      const page = 2;
      const limit = 1;
      const totalProducts = 2;
      const totalPages = Math.ceil(totalProducts / limit);
      const mockPaginatedProducts = [mockProducts[1]]; // Second product only

      prismaMock.productCategory.findUnique.mockResolvedValue(mockCategory as any);
      prismaMock.product.findMany.mockResolvedValue(mockPaginatedProducts as any);
      prismaMock.product.count.mockResolvedValue(totalProducts);

      const response = await request(app)
        .get(API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", mockStoreId))
        .query({ page, limit });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.products).toEqual(mockPaginatedProducts);
      expect(response.body.totalProducts).toBe(totalProducts);
      expect(response.body.totalPages).toBe(totalPages);
      expect(response.body.currentPage).toBe(page);
    });

    it("should handle invalid page query parameter gracefully", async () => {
      prismaMock.productCategory.findUnique.mockResolvedValue(mockCategory as any);
      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);
      prismaMock.product.count.mockResolvedValue(mockTotalProducts);

      const response = await request(app)
        .get(API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", mockStoreId))
        .query({ page: "invalid", limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // expect(response.body.currentPage).toBe(1); // Falls back to default page
      expect(response.body.products).toEqual(mockProducts);
    });

    it("should handle invalid storeId gracefully", async () => {
      prismaMock.productCategory.findUnique.mockResolvedValue(mockCategory as any);
      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(0);

      const response = await request(app).get(
        API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", "invalid-store"),
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.products).toEqual([]);
      expect(response.body.totalProducts).toBe(0);
      expect(response.body.totalPages).toBe(0);
      expect(response.body.currentPage).toBe(1);
    });

    it("should handle server errors and call the next function", async () => {
      const mockError = new Error("Database connection failed");
      prismaMock.productCategory.findUnique.mockRejectedValue(mockError);

      const response = await request(app).get(
        API_PATHS.FIND_PRODUCT_CATEGORY.replace(":slug", mockSlug).replace(":storeId", mockStoreId),
      );

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/server error/i);
    });
  });
});
