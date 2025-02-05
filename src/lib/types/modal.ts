export type ModalType = "board" | "task" | "column";

export interface ModalData {
  id: string;
  type: ModalType;
  isOpen: boolean;
}

export interface ModalState {
  modals: Map<string, ModalData>;
  activeModals: string[];
}

export type ModalActions = {
  openModal: (type: ModalType, id: string) => void;
  closeModal: (type: ModalType, id: string) => void;
  closeAll: () => void;
};

export type ModalStore = ModalState & ModalActions;
