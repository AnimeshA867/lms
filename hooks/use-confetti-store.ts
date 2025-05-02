import { create } from "zustand";

type ConefettiStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useConfettiStore = create<ConefettiStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
