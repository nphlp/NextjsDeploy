"use client";

import { useSession } from "@lib/authClient";
import { Session } from "@lib/authServer";
import { useFetch } from "@utils/FetchHook";
import { ReactNode } from "react";
import { Context, ContextType } from "./context";
import { UserType, exampleSchedulesInputPageParams } from "./fetch";

type ContextProviderProps = {
    initialData: UserType;
    sessionServer: NonNullable<Session>;
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, sessionServer, children } = props;

    const { data: sessionClient, isPending } = useSession();
    const session = isPending ? sessionServer : sessionClient;

    if (!session) throw new Error("No session in Provider");

    // Reactive fetch
    const { data, setDataBypass, isLoading, refetch } = useFetch({
        route: "/internal/user/findUnique",
        params: exampleSchedulesInputPageParams({ userId: session.user.id }),
        initialData,
    });

    // Context values
    const value: ContextType = {
        data,
        isLoading,
        setDataBypass,
        refetch,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
