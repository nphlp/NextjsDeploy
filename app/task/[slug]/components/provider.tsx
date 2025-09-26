"use client";

import { TaskModel } from "@services/types";
import { useFetch } from "@utils/FetchHook";
import { ReactNode, useState } from "react";
import { Context } from "./context";

type ContextProviderProps = {
    initialData: TaskModel;
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, children } = props;

    const [slug, setSlug] = useState<string>(initialData.slug);

    const { data, isLoading, refetch } = useFetch({
        route: "/internal/task/findUnique",
        params: { where: { slug } },
        initialData,
    });

    if (!data) {
        throw new Error("Task not found");
    }

    const value = { data, isLoading, setSlug, refetch };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
