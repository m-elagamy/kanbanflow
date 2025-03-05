import type { EntityType, Operation } from "@/lib/types";

const createKey = (entity: EntityType, operation?: Operation, id?: string) =>
  `${entity}:${operation}:${id}`;

export { createKey };
