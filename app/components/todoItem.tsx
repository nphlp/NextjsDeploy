"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Input from "@comps/UI/input/input";
import Select from "@comps/UI/select/select";
import { combo } from "@lib/combo";
import { TaskModel } from "@services/types";
import { CircleCheckBig, CircleDashed, LoaderCircle, Pencil, X } from "lucide-react";
import { Route } from "next";
import { useContext, useState } from "react";
import { DeleteTask, UpdateTask } from "@/actions/Task";
import { Context } from "./context";

const options = [
    {
        slug: "TODO",
        label: (
            <div className="flex items-center gap-2">
                <CircleDashed className="size-4" />
                <span>À faire</span>
            </div>
        ),
    },
    {
        slug: "IN_PROGRESS",
        label: (
            <div className="flex items-center gap-2">
                <LoaderCircle className="size-4" />
                <span>En cours</span>
            </div>
        ),
    },
    {
        slug: "DONE",
        label: (
            <div className="flex items-center gap-2">
                <CircleCheckBig className="size-4" />
                <span>Terminé</span>
            </div>
        ),
    },
];

type TodoItemProps = {
    task: TaskModel;
};

export default function TodoItem(props: TodoItemProps) {
    const { task } = props;
    const { id } = task;

    const [title, setTitle] = useState<string>(task.title);
    const [status, setStatus] = useState<string>(task.status);

    const { refetch } = useContext(Context);

    const handleTitleUpdate = async () => {
        if (title === task.title) return;
        if (!title.length) return refetch();
        await UpdateTask({ id, title });
        refetch();
    };

    const handleStatusUpdate = async (statusChange: string) => {
        if (statusChange === task.status) return;
        await UpdateTask({ id, status: statusChange });
        refetch();
    };

    const handleDelete = async () => {
        await DeleteTask({ id });
        refetch();
    };

    return (
        <div className="flex flex-row gap-2">
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
            <Select
                label={`Status ${task.status}`}
                className={{
                    component: "w-[220px] whitespace-nowrap",
                    button: "bg-background text-foreground border-gray-low",
                }}
                onSelectChange={handleStatusUpdate}
                setSelected={setStatus}
                selected={status}
                options={options}
                canNotBeEmpty
                noLabel
            />
            <Link
                label={`Edit ${task.title}`}
                variant="outline"
                href={`/task/${task.slug}` as Route}
                className="bg-background text-foreground border-gray-low px-1.5"
            >
                <Pencil />
            </Link>
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
    const width = (min: number, max: number) => {
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
                    style={{ width: width(50, 90) }}
                    className={combo("h-5", "relative top-1/2 -translate-y-1/2", "bg-gray-low animate-pulse rounded")}
                />
            </div>
            <div
                className={combo(
                    "relative h-[38px] w-[220px] px-4",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    style={{ width: width(65, 75) }}
                    className={combo("h-5", "relative top-1/2 -translate-y-1/2", "bg-gray-low animate-pulse rounded")}
                />
                <div
                    className={combo(
                        "size-5",
                        "absolute top-1/2 right-4 -translate-y-1/2",
                        "bg-gray-low animate-pulse rounded",
                    )}
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
