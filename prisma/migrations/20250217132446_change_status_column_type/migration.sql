/*
  Warnings:

  - You are about to drop the column `title` on the `Column` table. All the data in the column will be lost.
  - Added the required column `status` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ColumnStatus" AS ENUM ('To_Do', 'In_Progress', 'Done', 'Blocked', 'On_Hold', 'Testing', 'Under_Review', 'Cancelled', 'Backlog', 'Ready_For_Development', 'Deployed', 'Ready_For_Review');

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "title",
ADD COLUMN     "status" "ColumnStatus" NOT NULL;
