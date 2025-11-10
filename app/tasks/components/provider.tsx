"use client";

import { useSearchQueryParams, useUpdatedAtQueryParams } from "@comps/SHARED/filters/queryParamsClientHooks";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { ReactNode, useOptimistic } from "react";
import { Context, ContextType } from "./context";
import { TaskType } from "./fetch";
import { optimisticMutations } from "./optimistic";

type ContextProviderProps = {
    initialData: TaskType[];
    sessionServer: NonNullable<Session>;
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, sessionServer, children } = props;

    const { data: sessionClient, isPending } = useSession();
    const session = isPending ? sessionServer : sessionClient;

    if (!session) throw new Error("No session in Provider");

    const { updatedAt } = useUpdatedAtQueryParams();
    const { search } = useSearchQueryParams();

    // Reactive fetch
    // const { data, setDataBypass, isLoading, refetch } = useSolid({
    //     route: "/solid/task/findMany",
    //     params: taskPageParams({ updatedAt, search, userId: session.user.id }),
    //     initialData,
    // });

    const {
        data,
        setDataBypass,
        isFetching: isLoading,
        refetch,
    } = useFetch({
        client: oRPC.task.findMany,
        args: { updatedAt, search, userId: session.user.id },
        keys: [updatedAt, search, session.user.id],
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
