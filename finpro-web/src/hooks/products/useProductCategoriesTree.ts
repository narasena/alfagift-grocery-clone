import apiInstance from "@/services/apiInstance";
import { IProductCategory, IProductSubCategory } from "@/types/products/product.category.type";
import * as React from "react";

interface ICategoryNode {
  id: number;
  name: string;
  slug: string;
  children: ICategoryNode[];
  parentId: number | null;
}

export const useProductCategoriesTree = () => {
  const [categoryTree, setCategoryTree] = React.useState<ICategoryNode[]>([]);
  const [flatCategories, setFlatCategories] = React.useState<ICategoryNode[]>([]);

  const buildCategoryTree = (categories: ICategoryNode[]): ICategoryNode[] => {
    const nodesById = new Map<number, ICategoryNode>();
    const rootNodes: ICategoryNode[] = [];

    // Create map entries and initialize children arrays
    categories.forEach((category) => {
      nodesById.set(category.id, {
        ...category,
        children: [],
      });
    });

    // Build tree structure
    categories.forEach((category) => {
      const node = nodesById.get(category.id)!;
      const parentId = category.parentId;

      if (parentId === null) {
        rootNodes.push(node);
      } else {
        const parent = nodesById.get(parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Handle orphaned nodes (optional)
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  };

  const handleGetProductCategories = async () => {
    try {
      const categoryResponse = await apiInstance.get("/product-category");
      const subCategoryResponse = await apiInstance.get("/product-category/subcategories");

      const categories = categoryResponse.data.productCategories.map((cat: IProductCategory) => ({
        ...cat,
        parentId: null,
        children: [],
      }));

      const subCategories = subCategoryResponse.data.productSubCategories.map((subCat: IProductSubCategory) => ({
        ...subCat,
        parentId: subCat.productCategoryId,
        children: [],
      }));

      const allCategories = [...categories, ...subCategories];
      setFlatCategories(allCategories);

      const tree = buildCategoryTree(allCategories);
      setCategoryTree(tree);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  React.useEffect(() => {
    handleGetProductCategories();
  }, []);

  return {
    categoryTree,
    flatCategories,
  };
};
