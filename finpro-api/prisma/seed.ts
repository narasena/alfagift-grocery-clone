import { productCategories } from '../src/data/products/productCategory';
import { prisma } from '../src/prisma';

async function seedProductCategory() {
  console.log(`🌱 Seeding product category...`);
  const categories = Object.keys(productCategories).map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  }));
  try {
    console.log(`Total categories: ${categories.length}`);
    for (const category of categories) {
      await prisma.productCategory.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }
    console.log(`Seeding product category completed!`);
  } catch (error) {
    console.error(`Error seeding product category: ${error}`);
  }
}

async function seedProductSubCategory() {
  console.log(`🌱 Seeding product subcategory...`);
  const categoryRecords = await prisma.productCategory.findMany();
  
  try {
    for (const [category, subCategory] of Object.entries(productCategories)) {
      const categoryId = categoryRecords.find(c => c.name === category)?.id;
      if(!categoryId) {
        console.error(`Category ${category} not found!`);
        continue;
      }
      for (const name of subCategory) {
        await prisma.productSubCategory.upsert({
          where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            productCategoryId: categoryId,
          }
        })
      }
    }
    console.log(`Seeding product subcategory completed!`);
  } catch (error) {
    console.error(`Error seeding product subcategory: ${error}`);
  }
}

async function main() {
  console.log(`🌱🌱🌱 Seeding database...`);
  await seedProductCategory();
  await seedProductSubCategory();
  console.log(`🌱🌱 Seeding completed! 🌱🌱`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
