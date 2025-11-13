"use client";

import { zustandCookieStorage } from "@lib/zustand-cookie-client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FruitDisplayStore = {
    // State
    take: 3 | 10;

    // Actions
    setTake: (take: 3 | 10) => void;
    toggleTake: () => void;
};

export const useFruitDisplayStore = create<FruitDisplayStore>()(
    persist(
        (set, get) => ({
            // State
            take: 3,

            // Actions
            setTake: (take) => set({ take }),
            toggleTake: () => set({ take: get().take === 3 ? 10 : 3 }),
        }),
        {
            // Cookie name
            name: "fruit-display-cookie",
            // Persist in cookies
            storage: createJSONStorage(() => zustandCookieStorage),
            // Persist only the take state and not actions
            partialize: (state) => ({ take: state.take }),
        },
    ),
);
