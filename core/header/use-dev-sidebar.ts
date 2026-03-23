"use client";

import { createExternalStore, useExternalStore } from "@utils/use-external-store";

const sidebarStore = createExternalStore(false);

export default function useDevSidebar() {
    const [open, setOpen] = useExternalStore(sidebarStore);
    const toggle = () => setOpen((prev) => !prev);
    return { open, setOpen, toggle };
}
