"use client";

import { useSearchQueryParams, useUpdatedAtQueryParams } from "@comps/SHARED/filters/queryParamsClientHooks";
import { useFetch } from "@utils/FetchHook";
import { ReactNode, useOptimistic } from "react";
import { Context, ContextType } from "./context";
import { TaskType, homePageParams } from "./fetch";
import { optimisticMutations } from "./optimistic";

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
        params: homePageParams({ updatedAt, search }),
        initialData,
    });

    // Optimistic management
    const [optimisticData, setOptimisticData] = useOptimistic(data, optimisticMutations);

    // Context values
    const value: ContextType = {
        optimisticData,
        isLoading,
        setDataBypass,
        refetch,
        setOptimisticData,
        optimisticMutations,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
