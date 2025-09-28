"use client";

import { useOptimistic, useState } from "react";

type IdObject<T extends { id: string } = { id: string }> = T;

type OptimisticAction<T> = {
    type: "add" | "update" | "delete";
    newItem: T;
};

const optimisticMutations = (currentItems: IdObject[], action: OptimisticAction<IdObject>): IdObject[] => {
    const { type, newItem } = action;

    switch (type) {
        case "add":
            return [newItem, ...currentItems];
        case "update":
            return currentItems.map((item) => {
                if (item.id === newItem.id) return newItem;
                return item;
            });
        case "delete":
            return currentItems.filter((item) => item.id !== newItem.id);
    }
};

export default function useInstantArray(initialData: IdObject[]) {
    // Use state
    const [data, setData] = useState(initialData);

    // Use optimistic state
    const [optimisticData, setOptimisticData] = useOptimistic(data, optimisticMutations);

    return { optimisticData, setData, setOptimisticData, optimisticMutations };
}

// const handleMutation = () => {
//     startTransition(async () => {
//         // New item
//         const newItem: TaskType = task;

//         // Set optimistic state
//         setOptimisticData({ type: "delete", newItem });

//         // Do mutation
//         const validatedItem = await DeleteTask({ id: newItem.id });

//         // If failed, the optimistic state is rolled back at the end of the transition
//         if (!validatedItem) return console.log("❌ Deletion failed");

//         // If success, update the real state in a new transition to prevent key conflict
//         startTransition(() =>
//             setData((current) => optimisticMutations(current, { type: "delete", newItem: validatedItem })),
//         );

//         // If redirection, do it after the real state change
//         if (redirectTo) router.push(redirectTo);

//         console.log("✅ Deletion succeeded");
//     });
// };
