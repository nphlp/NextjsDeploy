"use client";

import { RefetchType } from "@utils/FetchHook";
import { Dispatch, SetStateAction, createContext } from "react";
import { UserType } from "./fetch";

export type ContextType = {
    data: UserType | null | undefined;
    isLoading: boolean;
    setDataBypass: Dispatch<SetStateAction<UserType | null | undefined>>;
    refetch: RefetchType;
};

export const Context = createContext<ContextType>({} as ContextType);
