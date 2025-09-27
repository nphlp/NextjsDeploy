"use client";

import ButtonDeleteTask from "@comps/SHARED/button-delete-task";
import InputUpdateTaskTitle from "@comps/SHARED/input-update-task-title";
import SelectUpdateTaskStatus from "@comps/SHARED/select-update-task-status";
import Link from "@comps/UI/button/link";
import { combo } from "@lib/combo";
import { TaskModel } from "@services/types";
import { Pencil } from "lucide-react";
import { Route } from "next";
import { useContext } from "react";
import { Context } from "./context";

type TodoItemProps = {
    task: TaskModel;
};

export default function TodoItem(props: TodoItemProps) {
    const { task } = props;

    const { refetch } = useContext(Context);

    return (
        <div className="flex flex-row gap-2">
            <InputUpdateTaskTitle
                task={task}
                refetch={refetch}
                className={{
                    component: "w-full",
                    input: "rounded-none border-x-0 border-t-transparent px-0 py-1 text-lg focus:border-t-transparent focus:ring-0",
                }}
            />
            <SelectUpdateTaskStatus task={task} className={{ component: "w-[150px] shrink-0 max-md:hidden" }} />
            <Link label={`Edit ${task.title}`} variant="outline" href={`/task/${task.id}` as Route} className="px-1.5">
                <Pencil />
            </Link>
            <ButtonDeleteTask task={task} className={{ button: "max-xs:hidden px-1.5" }} refetch={refetch} />
        </div>
    );
}

type TodoItemSkeletonProps = {
    index: number;
};

export function TodoItemSkeleton(props: TodoItemSkeletonProps) {
    const { index } = props;

    const width = (min: number, max: number, index: number = 0) => {
        const random = [0.8, 0.2, 0.95, 0.6, 0.3];
        const widthInRange = Math.floor(random[index % random.length] * (max - min + 1)) + min;
        return `${widthInRange}%`;
    };

    return (
        <div className="flex w-full items-center gap-2">
            <div
                className={combo(
                    "relative h-[38px] w-full",
                    "text-foreground bg-background border-b-gray-low animate-pulse border-y border-t-transparent",
                )}
            >
                <div
                    style={{ width: width(50, 90, index) }}
                    className={combo("h-5", "relative top-1/2 -translate-y-1/2", "bg-gray-low animate-pulse rounded")}
                />
            </div>
            <div
                className={combo(
                    "max-md:hidden",
                    "relative h-[38px] w-[150px] shrink-0 px-4",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    style={{ width: width(65, 75, index) }}
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
            <div
                className={combo(
                    "max-xs:hidden",
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
