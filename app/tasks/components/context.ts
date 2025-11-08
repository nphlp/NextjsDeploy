"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { RefetchType } from "@/solid/solid-hook";
import { TaskType } from "./fetch";
import { OptimisticAction } from "./optimistic";

export type ContextType = {
    optimisticData: TaskType[] | undefined;
    isLoading: boolean;
    setDataBypass: Dispatch<SetStateAction<TaskType[] | undefined>>;
    refetch: RefetchType;
    setOptimisticData: (action: OptimisticAction<TaskType>) => void;
    optimisticMutations: (currentItems: TaskType[] | undefined, action: OptimisticAction<TaskType>) => TaskType[];
};

export const Context = createContext<ContextType>({} as ContextType);
