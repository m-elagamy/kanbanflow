import type { EntityType, Operation } from "..";

type LoadingStore = {
  loadingMap: Map<string, boolean>;
  operationCounts: Map<string, number>;
  isLoading: (
    entity: EntityType,
    operation?: Operation,
    id?: string,
  ) => boolean;
  setIsLoading: (
    entity: EntityType,
    operation: Operation,
    isLoading: boolean,
    id?: string,
  ) => void;
};

export type { LoadingStore };
