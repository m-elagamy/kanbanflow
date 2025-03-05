import { create } from "zustand";
import type { LoadingStore } from "@/lib/types/stores/loading";
import { createKey } from "@/utils/stores";

const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingMap: new Map(),

  isLoading: (entity, operation, id) => {
    const { loadingMap } = get();

    // If ID is provided, check specific item
    if (id) {
      return loadingMap.has(createKey(entity, operation, id));
    }

    // Otherwise check if any items are loading for this entity+operation
    const prefix = `${entity}:${operation}:`;
    const isLoading = Array.from(loadingMap.keys()).some((key) =>
      key.startsWith(prefix),
    );

    return isLoading;
  },
  setIsLoading: (entity, operation, isLoading, id) => {
    set((state) => {
      const newMap = new Map(state.loadingMap);
      const key = createKey(entity, operation, id);

      if (isLoading) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }

      return { loadingMap: newMap };
    });
  },
}));

export default useLoadingStore;
