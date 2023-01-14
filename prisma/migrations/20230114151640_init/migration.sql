/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_teacherId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
