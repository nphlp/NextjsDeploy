"use client";

import { TaskModel } from "@services/types";
import { useFetch } from "@utils/FetchHook";
import { ReactNode } from "react";
import { Context } from "./context";

type ContextProviderProps = {
    initialData: TaskModel[];
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, children } = props;

    const { data, isLoading, refetch } = useFetch({
        route: "/internal/task/findMany",
        params: { orderBy: { updatedAt: "desc" } },
        initialData,
    });

    const value = { data, isLoading, refetch };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
