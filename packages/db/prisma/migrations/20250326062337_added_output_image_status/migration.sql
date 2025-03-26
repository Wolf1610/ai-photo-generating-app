-- CreateEnum
CREATE TYPE "OutputImageStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "status" "OutputImageStatusEnum" NOT NULL DEFAULT 'Pending';
