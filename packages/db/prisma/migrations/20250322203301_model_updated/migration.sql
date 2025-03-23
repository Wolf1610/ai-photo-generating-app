/*
  Warnings:

  - You are about to drop the column `ethenicity` on the `Model` table. All the data in the column will be lost.
  - Added the required column `ethinicity` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "ethenicity",
ADD COLUMN     "ethinicity" "EthenecityEnum" NOT NULL;
