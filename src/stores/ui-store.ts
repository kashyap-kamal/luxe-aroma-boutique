import { create } from "zustand";

interface UIStore {
  navDrawerOpen: boolean;
  openNavDrawer: () => void;
  closeNavDrawer: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  navDrawerOpen: false,
  openNavDrawer: () => set({ navDrawerOpen: true }),
  closeNavDrawer: () => set({ navDrawerOpen: false }),
}));
