"use client";

import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { Dispatch, SetStateAction, createContext } from "react";

export type ContextType = {
    data: TaskModel;
    isLoading: boolean;
    setSlug?: Dispatch<SetStateAction<string>>;
    refetch: RefetchType;
};

export const Context = createContext<ContextType>({} as ContextType);
