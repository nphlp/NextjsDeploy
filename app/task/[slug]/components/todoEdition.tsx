"use client";

import ButtonDeleteTask from "@comps/SHARED/button-delete-task";
import InputUpdateTaskTitle from "@comps/SHARED/input-update-task-title";
import SelectUpdateTaskStatus from "@comps/SHARED/select-update-task-status";
import { useContext } from "react";
import { Context } from "./context";

export default function TodoEdition() {
    const { data, refetch } = useContext(Context);

    return (
        <div className="space-y-4">
            <InputUpdateTaskTitle
                task={data}
                refetch={refetch}
                className={{
                    component: "w-full",
                    input: "text-foreground bg-background border-gray-low focus:border-gray-high rounded-none border-x-0 border-t-0 px-0.5 text-xl font-bold ring-transparent",
                }}
                autoFocus
            />
            <div className="flex justify-between gap-2">
                <SelectUpdateTaskStatus task={data} refetch={refetch} className={{ component: "w-full" }} />
                <ButtonDeleteTask
                    task={data}
                    className={{ button: "bg-background text-foreground border-gray-low px-1.5" }}
                    redirectTo="/"
                />
            </div>
        </div>
    );
}
