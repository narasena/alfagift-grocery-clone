import request from "supertest";
import App from "../../app";
import { Express } from "express";
import { prismaMock } from "../setup";
import describeEndPoint from "@/utils/tests/describeEndPoint";

const API_PATHS = {
  GET_PRODUCT_CATEGORIES: "/api/product-category",
  GET_PRODUCT_SUB_CATEGORIES: "/api/product-category/subcategories",
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

      const response = await request(app).get("/api/product-category");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal server error. Please try again later!");
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
      expect(response.body.message).toBe("Internal server error. Please try again later!");
    });
  });
});
