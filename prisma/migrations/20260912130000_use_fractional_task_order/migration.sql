ALTER TABLE "Task" ADD COLUMN "fractionalOrder" TEXT COLLATE "C";

CREATE FUNCTION task_fractional_key(position_value BIGINT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  alphabet CONSTANT TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  remaining BIGINT := position_value;
  capacity BIGINT := 62;
  width INTEGER := 1;
  encoded TEXT := '';
  digit INTEGER;
BEGIN
  WHILE remaining >= capacity LOOP
    remaining := remaining - capacity;
    width := width + 1;
    capacity := capacity * 62;
  END LOOP;

  FOR step_index IN 1..width LOOP
    digit := (remaining % 62)::INTEGER;
    encoded := substr(alphabet, digit + 1, 1) || encoded;
    remaining := remaining / 62;
  END LOOP;

  RETURN chr(ascii('a') + width - 1) || encoded;
END;
$$;

WITH ranked_tasks AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY "columnId"
      ORDER BY "order" ASC, id ASC
    ) - 1 AS position
  FROM "Task"
)
UPDATE "Task" AS task
SET "fractionalOrder" = task_fractional_key(ranked_tasks.position)
FROM ranked_tasks
WHERE task.id = ranked_tasks.id;

DROP FUNCTION task_fractional_key(BIGINT);

DROP INDEX IF EXISTS "Task_columnId_order_idx";
ALTER TABLE "Task" DROP COLUMN "order";
ALTER TABLE "Task" RENAME COLUMN "fractionalOrder" TO "order";
ALTER TABLE "Task" ALTER COLUMN "order" SET NOT NULL;

CREATE UNIQUE INDEX "Task_columnId_order_key" ON "Task"("columnId", "order");
