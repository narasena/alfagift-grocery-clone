/*
  Warnings:

  - You are about to drop the column `buyQuantity` on the `product_discounts` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `product_discounts` table. All the data in the column will be lost.
  - You are about to drop the column `getQuantity` on the `product_discounts` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_discounts` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `product_discounts` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `refereeId` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `referrerId` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `totalUsageLimit` on the `vouchers` table. All the data in the column will be lost.
  - Made the column `userId` on table `vouchers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product_discounts" DROP CONSTRAINT "product_discounts_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_discounts" DROP CONSTRAINT "product_discounts_storeId_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_refereeId_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_referrerId_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_storeId_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_userId_fkey";

-- DropIndex
DROP INDEX "vouchers_refereeId_key";

-- AlterTable
ALTER TABLE "product_discounts" DROP COLUMN "buyQuantity",
DROP COLUMN "discountValue",
DROP COLUMN "getQuantity",
DROP COLUMN "productId",
DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "code",
DROP COLUMN "refereeId",
DROP COLUMN "referrerId",
DROP COLUMN "storeId",
DROP COLUMN "totalUsageLimit",
ADD COLUMN     "referralId" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "product_discounts_histories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_discounts_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_discounts_histories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "store_discounts_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_referrals" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_referrals_refereeId_key" ON "user_referrals"("refereeId");

-- AddForeignKey
ALTER TABLE "product_discounts_histories" ADD CONSTRAINT "product_discounts_histories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_discounts_histories" ADD CONSTRAINT "product_discounts_histories_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "product_discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_discounts_histories" ADD CONSTRAINT "store_discounts_histories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_discounts_histories" ADD CONSTRAINT "store_discounts_histories_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "product_discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "user_referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
