/*
  Warnings:

  - You are about to drop the column `name` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Column` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[columnId,title]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "name",
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'medium',
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "order" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Board_userId_title_key" ON "Board"("userId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Task_columnId_title_key" ON "Task"("columnId", "title");
