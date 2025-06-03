-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "cldPublicId" TEXT;

-- AlterTable
ALTER TABLE "payment_proofs" ADD COLUMN     "cldPublicId" TEXT;

-- AlterTable
ALTER TABLE "product_brands" ADD COLUMN     "cldPublicId" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "cldPublicId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cldPublicId" TEXT;
