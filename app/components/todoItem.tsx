"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { combo } from "@lib/combo";
import { TaskModel } from "@services/types";
import { CircleCheckBig, CircleDashed, LoaderCircle, X } from "lucide-react";
import { useContext, useState } from "react";
import { DeleteTask, UpdateTask } from "@/actions/Task";
import { Context } from "./context";

type TodoItemProps = {
    task: TaskModel;
};

export default function TodoItem(props: TodoItemProps) {
    const { task } = props;

    const [title, setTitle] = useState(task.title);

    const { refetch } = useContext(Context);

    const handleTitleUpdate = async () => {
        if (title === task.title) return;
        if (!title.length) return refetch();
        await UpdateTask(task.id, title, task.status);
        refetch();
    };

    const handleStatusUpdate = async () => {
        const nextStatus = task.status === "TODO" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "DONE" : "TODO";
        await UpdateTask(task.id, title, nextStatus);
        refetch();
    };

    const handleDelete = async () => {
        await DeleteTask(task.id);
        refetch();
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                label={`Task ${task.title}`}
                autoComplete="off"
                onBlur={handleTitleUpdate}
                setValue={setTitle}
                value={title}
                className={{
                    component: "w-full",
                    input: "text-foreground bg-background border-gray-low",
                }}
                noLabel
            />
            <Button
                label={`Status ${task.status}`}
                variant="outline"
                className={{ button: "bg-background text-foreground border-gray-low px-1.5" }}
                onClick={handleStatusUpdate}
            >
                {task.status === "TODO" && <CircleCheckBig />}
                {task.status === "IN_PROGRESS" && <LoaderCircle />}
                {task.status === "DONE" && <CircleDashed />}
            </Button>
            <Button
                label={`Status ${task.status}`}
                variant="outline"
                className={{ button: "bg-background text-foreground border-gray-low px-1.5" }}
                onClick={handleDelete}
            >
                <X />
            </Button>
        </div>
    );
}

export function TodoItemSkeleton() {
    const min = 70;
    const max = 100;

    const width = () => {
        const widthInRange = Math.floor(Math.random() * (max - min + 1)) + min;
        return `${widthInRange}%`;
    };

    return (
        <div className="flex w-full items-center gap-2">
            <div
                className={combo(
                    "relative h-[38px] w-full px-4",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    style={{ width: width() }}
                    className={combo("h-5", "relative top-1/2 -translate-y-1/2", "bg-gray-low animate-pulse rounded")}
                />
            </div>
            <div
                className={combo(
                    "relative size-[38px] shrink-0",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    className={combo(
                        "size-5",
                        "relative top-1/2 left-1/2 -translate-1/2",
                        "bg-gray-low animate-pulse rounded",
                    )}
                />
            </div>
        </div>
    );
}
