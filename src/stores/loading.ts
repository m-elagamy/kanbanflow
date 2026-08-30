import { create } from "zustand";
import type { LoadingStore } from "@/lib/types/stores/loading";
import { createKey } from "@/utils/stores";

const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingMap: new Map(),
  operationCounts: new Map(),

  isLoading: (entity, operation, id) => {
    const { loadingMap, operationCounts } = get();

    if (id) {
      return loadingMap.has(createKey(entity, operation, id));
    }

    return (operationCounts.get(`${entity}:${operation}`) ?? 0) > 0;
  },
  setIsLoading: (entity, operation, isLoading, id) => {
    set((state) => {
      const newMap = new Map(state.loadingMap);
      const key = createKey(entity, operation, id);
      const wasLoading = newMap.has(key);

      if (isLoading) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }

      const opKey = `${entity}:${operation}`;
      const newCounts = new Map(state.operationCounts);
      const currentCount = newCounts.get(opKey) ?? 0;

      if (isLoading && !wasLoading) {
        newCounts.set(opKey, currentCount + 1);
      } else if (!isLoading && wasLoading) {
        newCounts.set(opKey, Math.max(0, currentCount - 1));
      }

      return { loadingMap: newMap, operationCounts: newCounts };
    });
  },
}));

export default useLoadingStore;
