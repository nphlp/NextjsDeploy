"use client";

import Button from "@comps/UI/button/button";
import { isArray } from "lodash";
import { useContext } from "react";
import { Context } from "./context";
import { TaskType } from "./fetch";

export default function ButtonRefetch() {
    const { setDataBypass, refetch } = useContext(Context);

    const newData = () => {
        const date = new Date().toISOString();
        const newTask: TaskType = { id: date, status: "DONE", title: date };

        setDataBypass((previous) => {
            const previousSafe = isArray(previous) ? previous : [];
            return [newTask, ...previousSafe];
        });
    };

    return (
        <div className="grid grid-cols-2 gap-4 max-md:col-span-2">
            <Button
                label="SetData"
                onClick={() => newData()}
                className={{ button: "border-foreground hover:border-gray-high h-fit w-full border" }}
            />
            <Button
                label="Refetch"
                onClick={() => refetch()}
                className={{ button: "border-foreground hover:border-gray-high h-fit w-full border" }}
            />
        </div>
    );
}
