import type { ModalType } from "@/lib/types/modal";
import { useModalStore } from "@/stores/modal";
import { useEffect } from "react";

export default function useModalClose(
  state: { success?: boolean },
  modalType: ModalType,
  modalId: string,
): void {
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    if (state.success) {
      closeModal(modalType, modalId);
    }
  }, [state.success, modalType, modalId, closeModal]);
}
