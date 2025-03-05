import { create } from "zustand";
import type { ModalStore } from "@/lib/types/modal";
import type { EntityType } from "@/lib/types";

const generateModalKey = (type: EntityType, id: string) => `${type}-${id}`;

export const useModalStore = create<ModalStore>()((set, get) => ({
  modals: new Map(),
  activeModals: [],

  openModal: (type, id) => {
    const key = generateModalKey(type, id);
    const { modals, activeModals } = get();

    const newModals = new Map(modals);
    newModals.set(key, { id, type, isOpen: true });

    set({
      modals: newModals,
      activeModals: [...activeModals, key],
    });
  },

  closeModal: (type, id) => {
    const key = generateModalKey(type, id);
    const { modals, activeModals } = get();

    const newModals = new Map(modals);
    newModals.delete(key);

    set({
      modals: newModals,
      activeModals: activeModals.filter((k) => k !== key),
    });
  },

  closeAll: () => {
    set({ modals: new Map(), activeModals: [] });
  },
}));
