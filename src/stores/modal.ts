import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ModalStore, ModalType } from "@/lib/types/modal";

const generateModalKey = (type: ModalType, id: string) => `${type}-${id}`;

export const useModalStore = create<ModalStore>()(
  devtools(
    (set, get) => ({
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
    }),
    { name: "modal-store" },
  ),
);
