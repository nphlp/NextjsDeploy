"use client";

import { ReactNode, useOptimistic, useState } from "react";
import { Context } from "./context";
import { TaskType } from "./fetch";
import { optimisticMutations } from "./optimistic";

type ContextProviderProps = {
    initialData: TaskType[];
    children: ReactNode;
};

export default function Provider(props: ContextProviderProps) {
    const { initialData, children } = props;

    const [data, setData] = useState(initialData);

    const [optimisticData, setOptimisticData] = useOptimistic(data, optimisticMutations);

    const value = { optimisticData, setData, setOptimisticData, optimisticMutations };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
