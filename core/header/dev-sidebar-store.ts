import { create } from "zustand";

type DevSidebarStore = {
    open: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
};

const useDevSidebarStore = create<DevSidebarStore>((set) => ({
    open: false,
    toggle: () => set((state) => ({ open: !state.open })),
    setOpen: (open) => set({ open }),
}));

export default useDevSidebarStore;
