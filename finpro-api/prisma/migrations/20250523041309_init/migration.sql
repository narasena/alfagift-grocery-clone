/*
  Warnings:

  - The primary key for the `product_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `product_categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `product_sub_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `product_sub_categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `coordinates` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `user_addresses` table. All the data in the column will be lost.
  - Changed the type of `productCategoryId` on the `product_sub_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productSubCategoryId` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `latitude` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `user_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `user_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_sub_categories" DROP CONSTRAINT "product_sub_categories_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_productSubCategoryId_fkey";

-- AlterTable
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_sub_categories" DROP CONSTRAINT "product_sub_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productCategoryId",
ADD COLUMN     "productCategoryId" INTEGER NOT NULL,
ADD CONSTRAINT "product_sub_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "products" DROP COLUMN "productSubCategoryId",
ADD COLUMN     "productSubCategoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "coordinates",
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_addresses" DROP COLUMN "coordinates",
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productSubCategoryId_fkey" FOREIGN KEY ("productSubCategoryId") REFERENCES "product_sub_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
