import { create } from "zustand";

type ModalType = "board" | "task" | "column";

type ModalStore = {
  openModals: Record<ModalType, Record<string, boolean>>;
  openModal: (modalType: ModalType, id: string) => void;
  closeModal: (modalType: ModalType, id: string) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openModals: {
    board: {},
    task: {},
    column: {},
  },
  openModal: (modalType, id) =>
    set((state) => ({
      openModals: {
        ...state.openModals,
        [modalType]: { ...state.openModals[modalType], [id]: true },
      },
    })),
  closeModal: (modalType, id) =>
    set((state) => ({
      openModals: {
        ...state.openModals,
        [modalType]: { ...state.openModals[modalType], [id]: false },
      },
    })),
}));
