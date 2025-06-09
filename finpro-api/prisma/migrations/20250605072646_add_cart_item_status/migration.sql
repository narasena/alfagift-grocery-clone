/*
  Warnings:

  - Added the required column `status` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartItemStatus" AS ENUM ('ACTIVE', 'ORDERED', 'REMOVED');

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "status" "CartItemStatus" NOT NULL;
