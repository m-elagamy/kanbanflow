import { EntityType } from ".";

export interface ModalData {
  id: string;
  type: EntityType;
  isOpen: boolean;
}

export interface ModalState {
  modals: Map<string, ModalData>;
}

export type ModalActions = {
  openModal: (type: EntityType, id: string) => void;
  closeModal: (type: EntityType, id: string) => void;
};

export type ModalStore = ModalState & ModalActions;
