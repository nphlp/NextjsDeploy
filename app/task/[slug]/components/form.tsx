"use client";

import ButtonDeleteTask from "@comps/SHARED/button-delete-task";
import SelectUpdateTaskStatus from "@comps/SHARED/select-update-task-status";
import { useContext } from "react";
import { Context } from "./context";

export default function Form() {
    const { data, refetch } = useContext(Context);

    return (
        <div className="flex justify-between gap-2">
            <SelectUpdateTaskStatus task={data} refetch={refetch} className={{ component: "w-full" }} />
            <ButtonDeleteTask
                task={data}
                refetch={refetch}
                className={{ button: "bg-background text-foreground border-gray-low px-1.5" }}
            />
        </div>
    );
}
