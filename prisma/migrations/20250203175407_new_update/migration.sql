/*
  Warnings:

  - A unique constraint covering the columns `[userId,slug]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Board_slug_key";

-- DropIndex
DROP INDEX "Board_userId_idx";

-- DropIndex
DROP INDEX "Board_userId_title_key";

-- DropIndex
DROP INDEX "Column_boardId_idx";

-- DropIndex
DROP INDEX "Task_columnId_idx";

-- CreateIndex
CREATE INDEX "Board_userId_order_idx" ON "Board"("userId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Board_userId_slug_key" ON "Board"("userId", "slug");

-- CreateIndex
CREATE INDEX "Column_boardId_order_idx" ON "Column"("boardId", "order");

-- CreateIndex
CREATE INDEX "Task_columnId_order_idx" ON "Task"("columnId", "order");
