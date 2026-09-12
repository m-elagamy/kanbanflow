CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Task_title_trgm_idx"
ON "Task" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "Task_description_trgm_idx"
ON "Task" USING GIN ("description" gin_trgm_ops);
