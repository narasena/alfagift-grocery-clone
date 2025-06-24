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

async function seedProductInventories() {
  console.log('🌱 Seeding Initial Product Inventories...')
  const stores = await prisma.store.findMany({ where: { deletedAt: null } });
  const products = await prisma.product.findMany({ where: { deletedAt: null } });
  
  try {
    await prisma.productStock.createMany({
      data: products.flatMap(product => 
        stores.map(store => ({
          productId: product.id,
          storeId: store.id,
          stock: 0
        }))
      ),
      skipDuplicates: true
    })
    console.log(`Seeded ${products.length * stores.length} product inventories`);
  } catch (error) {
    console.error(`Error seeding product inventories: ${error}`);    
  }
  
}

async function main() {
  console.log(`🌱🌱🌱 Seeding database...`);
  await seedProductCategory();
  await seedProductSubCategory();
  await seedProductInventories();
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
