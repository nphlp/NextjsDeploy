"use client";

import { useOptimistic, useState } from "react";

// export type OptimisticAction<T> = {
//     type: "add" | "update" | "delete";
//     newItem: T;
// };

// export const optimisticMutations = <T extends { id: string }>(currentItems: T[], action: OptimisticAction<T>): T[] => {
//     const { type, newItem } = action;

//     switch (type) {
//         case "add":
//             return [newItem, ...currentItems];
//         case "update":
//             return currentItems.map((item) => {
//                 if (item.id === newItem.id) return newItem;
//                 return item;
//             });
//         case "delete":
//             return currentItems.filter((item) => item.id !== newItem.id);
//     }
// };

export default function useInstant<T extends object>(initialData: T) {
    // Use state
    const [data, setData] = useState(initialData);

    // Use optimistic state
    const [optimisticData, setOptimisticData] = useOptimistic(data);

    return { optimisticData, setData, setOptimisticData };
}
