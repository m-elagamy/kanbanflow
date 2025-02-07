import { useEffect } from "react";

export default function useModalClose(
  state: { success: boolean },
  closeModal: (modalType: string, modalId: string) => void,
  modalType: string,
  modalId: string,
): void {
  useEffect(() => {
    if (state.success) {
      closeModal(modalType, modalId);
    }
  }, [state.success, modalType, modalId, closeModal]);
}
