"use client";

import Link from "@comps/SHADCN/components/link";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import ButtonDeleteTask, { ButtonDeleteTaskSkeleton } from "@comps/SHARED/optimistics/button-delete-task";
import InputUpdateTaskTitle, { InputUpdateTaskTitleSkeleton } from "@comps/SHARED/optimistics/input-update-task-title";
import SelectUpdateTaskStatus, {
    SelectUpdateTaskStatusSkeleton,
} from "@comps/SHARED/optimistics/select-update-task-status";
import { Pencil } from "lucide-react";
import { Route } from "next";
import { useContext } from "react";
import { Context } from "./context";
import { TaskType } from "./fetch";

type TodoItemProps = {
    task: TaskType;
};

export default function Item(props: TodoItemProps) {
    const { task } = props;

    const { refetch } = useContext(Context);

    return (
        <div className="flex flex-row gap-2">
            <InputUpdateTaskTitle
                task={task}
                className="w-full rounded-none border-x-0 border-t-transparent px-0 focus:border-t-transparent focus:ring-0"
            />
            <SelectUpdateTaskStatus task={task} className="w-[150px] shrink-0 max-md:hidden" />
            <Link
                aria-label={`Edit ${task.title}`}
                variant="outline"
                href={`/task/${task.id}` as Route}
                className="px-1.5"
            >
                <Pencil className="size-6" />
            </Link>
            <ButtonDeleteTask task={task} refetch={refetch} className="max-xs:hidden px-1.5" />
        </div>
    );
}

type TodoItemSkeletonProps = {
    index: number;
};

export function ItemSkeleton(props: TodoItemSkeletonProps) {
    const { index } = props;

    return (
        <div className="flex w-full items-center gap-2">
            <InputUpdateTaskTitleSkeleton index={index} />
            <SelectUpdateTaskStatusSkeleton index={index} className="w-[150px] max-md:hidden" />
            <Skeleton className="h-9 w-9 shrink-0" />
            <ButtonDeleteTaskSkeleton className="max-xs:hidden" />
        </div>
    );
}
