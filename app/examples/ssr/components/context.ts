"use client";

import { RefetchType } from "@utils/FetchHook";
import { Dispatch, SetStateAction, createContext } from "react";
import { TaskType } from "./fetch";

export type ContextType = {
    data: TaskType[] | undefined;
    setDataBypass: Dispatch<SetStateAction<TaskType[] | undefined>>;
    isLoading: boolean;
    refetch: RefetchType;
};

export const Context = createContext<ContextType>({} as ContextType);
