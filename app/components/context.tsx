"use client";

import { TaskModel } from "@services/types";
import { createContext } from "react";

export type ContextType = {
    data: TaskModel[] | undefined;
    isLoading: boolean;
    refetch: (offsetTime?: number) => void;
};

const initialContextData: ContextType = {
    data: undefined,
    isLoading: false,
    refetch: () => {},
};

export const Context = createContext<ContextType>(initialContextData);
