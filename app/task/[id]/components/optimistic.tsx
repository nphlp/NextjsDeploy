import { TaskType } from "./fetch";

export type OptimisticAction<T> = {
    type: "add" | "update" | "delete";
    newItem: T;
};

export const optimisticMutations = (currentItems: TaskType, action: OptimisticAction<TaskType>): TaskType => {
    const { type, newItem } = action;

    switch (type) {
        case "add":
            return newItem;
        case "update":
            return newItem;
        case "delete":
            return newItem;
    }
};
