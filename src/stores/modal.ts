import { create } from "zustand";
import type { ModalStore } from "@/lib/types/modal";
import type { EntityType } from "@/lib/types";

const generateModalKey = (type: EntityType, id: string) => `${type}-${id}`;

export const useModalStore = create<ModalStore>()((set, get) => ({
  modals: new Map(),

  openModal: (type, id) => {
    const key = generateModalKey(type, id);
    const { modals } = get();

    set({
      modals: new Map([...modals, [key, { id, type, isOpen: true }]]),
    });
  },

  closeModal: (type, id) => {
    const key = generateModalKey(type, id);
    const { modals } = get();

    const newModals = new Map(modals);
    newModals.delete(key);

    set({ modals: newModals });
  },
}));
