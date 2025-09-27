import { TaskType } from "./fetch";

export type OptimisticAction<T> = {
    type: "add" | "update" | "delete";
    newItem: T;
};

export const optimisticMutations = (currentItems: TaskType[], action: OptimisticAction<TaskType>): TaskType[] => {
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
