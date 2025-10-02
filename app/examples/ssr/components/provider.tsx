"use client";

import { useSearchQueryParams, useUpdatedAtQueryParams } from "@comps/SHARED/filters/queryParamsClientHooks";
import { useFetch } from "@utils/FetchHook";
import { ReactNode } from "react";
import { Context, ContextType } from "./context";
import { TaskType, exampleSrrPageParams } from "./fetch";

type ContextProviderProps = {
    initialData: TaskType[];
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, children } = props;

    const { updatedAt } = useUpdatedAtQueryParams();
    const { search } = useSearchQueryParams();

    // Reactive fetch
    const { data, setDataBypass, isLoading, refetch } = useFetch({
        route: "/internal/task/findMany",
        params: exampleSrrPageParams({ updatedAt, search }),
        initialData,
        debounce: 200,
    });

    // Context values
    const value: ContextType = { data, setDataBypass, isLoading, refetch };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
