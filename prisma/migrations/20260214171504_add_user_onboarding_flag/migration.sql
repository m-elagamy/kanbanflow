/*
  Warnings:

  - Changed the type of `status` on the `Column` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasCreatedBoardOnce" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "ColumnStatus";
