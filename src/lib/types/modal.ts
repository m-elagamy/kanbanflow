import { EntityType } from ".";

export interface ModalData {
  id: string;
  type: EntityType;
  isOpen: boolean;
}

export interface ModalState {
  modals: Map<string, ModalData>;
  activeModals: string[];
}

export type ModalActions = {
  openModal: (type: EntityType, id: string) => void;
  closeModal: (type: EntityType, id: string) => void;
  closeAll: () => void;
};

export type ModalStore = ModalState & ModalActions;
