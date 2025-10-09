import { TaskType } from "./fetch";

export type OptimisticAction<T> = {
    type: "add" | "update" | "delete";
    newItem: T;
};

export const optimisticMutations = (
    currentItems: TaskType[] | undefined,
    action: OptimisticAction<TaskType>,
): TaskType[] => {
    const currentItemsSafe = currentItems ?? [];
    const { type, newItem } = action;

    switch (type) {
        case "add":
            return [newItem, ...currentItemsSafe];
        case "update":
            return currentItemsSafe.map((item) => {
                if (item.id === newItem.id) return newItem;
                return item;
            });
        case "delete":
            return currentItemsSafe.filter((item) => item.id !== newItem.id);
    }
};
