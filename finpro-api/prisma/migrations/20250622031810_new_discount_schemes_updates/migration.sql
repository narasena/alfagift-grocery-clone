/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payment_proofs` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedBy` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `maxDiscountValue` on the `product_discounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountedPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountedShippingCost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountedTotalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalShippingCost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalTotalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `payment_proofs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('PRICE_CUT', 'FREE_SHIPPING', 'REFERRAL');

-- CreateEnum
CREATE TYPE "DiscountValueType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- DropForeignKey
ALTER TABLE "payment_proofs" DROP CONSTRAINT "payment_proofs_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_verifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "product_discounts" DROP CONSTRAINT "product_discounts_productId_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "discountedPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discountedShippingCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discountedTotalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "finalShippingCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "finalTotalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "payment_proofs" DROP COLUMN "transactionId",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentStatus",
DROP COLUMN "verifiedAt",
DROP COLUMN "verifiedBy";

-- AlterTable
ALTER TABLE "product_discounts" DROP COLUMN "maxDiscountValue",
ADD COLUMN     "buyQuantity" INTEGER,
ADD COLUMN     "getQuantity" INTEGER,
ADD COLUMN     "isGlobalStore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usageLimitPerTransaction" INTEGER,
ALTER COLUMN "discountValue" DROP NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referralCode" TEXT;

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "voucherType" "VoucherType" NOT NULL,
    "discountId" TEXT,
    "discountValue" DOUBLE PRECISION,
    "discountValueType" "DiscountValueType" NOT NULL,
    "maxTotalDiscountValue" DOUBLE PRECISION,
    "userId" TEXT,
    "generatorOrderId" TEXT,
    "storeId" TEXT,
    "referrerId" TEXT,
    "refereeId" TEXT,
    "expiredDate" TIMESTAMP(3) NOT NULL,
    "minTransactionTimes" INTEGER,
    "usageLimitPerUser" INTEGER,
    "totalUsageLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_usages" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "discountedAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "voucher_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_histories" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "verifiedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payment_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_refereeId_key" ON "vouchers"("refereeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- AddForeignKey
ALTER TABLE "product_discounts" ADD CONSTRAINT "product_discounts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "product_discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_generatorOrderId_fkey" FOREIGN KEY ("generatorOrderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_histories" ADD CONSTRAINT "payment_histories_verifiedByAdminId_fkey" FOREIGN KEY ("verifiedByAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_histories" ADD CONSTRAINT "payment_histories_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
