-- Existing due dates are intentionally removed. Existing tasks start their
-- column-age clock when this migration is applied.
ALTER TABLE "Task"
ADD COLUMN "columnEnteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "dueDate";
