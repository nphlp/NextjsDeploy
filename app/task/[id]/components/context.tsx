"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { TaskType } from "./fetch";
import { OptimisticAction } from "./optimistic";

export type ContextType = {
    optimisticData: TaskType;
    setData: Dispatch<SetStateAction<TaskType>>;
    setOptimisticData: (action: OptimisticAction<TaskType>) => void;
    optimisticMutations: (currentItems: TaskType, action: OptimisticAction<TaskType>) => TaskType;
};

export const Context = createContext<ContextType>({} as ContextType);
