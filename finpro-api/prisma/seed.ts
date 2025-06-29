import generateCodeTenChars from '../src/utils/code.generator/codeGeneratorTenChars';
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


// async function seedReferralCodes() {
//   console.log('🌱 Seeding Referral Codes...')
//   try {
//     // Get all users and existing referral codes in one query
//     const [users, existingCodes] = await Promise.all([
//       prisma.user.findMany({ 
//         where: { deletedAt: null },
//         select: { id: true }
//       }),
//       prisma.user.findMany({
//         where: { 
//           deletedAt: null,
//           referralCode: { not: null }
//         },
//         select: { referralCode: true }
//       })
//     ]);

//     const existingCodesSet = new Set(existingCodes.map(u => u.referralCode));
//     const updates = [];

//     // Generate unique codes without DB queries
//     for (const user of users) {
//       let referralCode = generateCodeTenChars();
//       while (existingCodesSet.has(referralCode)) {
//         referralCode = generateCodeTenChars();
//       }
//       existingCodesSet.add(referralCode);
//       updates.push(
//         prisma.user.update({
//           where: { id: user.id },
//           data: { referralCode }
//         })
//       );
//     }

//     // Batch update all users
//     await Promise.all(updates);
//     console.log(`Seeding referral codes completed!`);
//   } catch (error) {
//     console.error(`Error seeding referral codes: ${error}`);
//   }
// }

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
  // ⬇️⬇️⬇️ comment the line you don't want to seed to run!!
  // await seedProductCategory();
  // await seedProductSubCategory();
  // await seedProductInventories();
  // await seedReferralCodes();
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
