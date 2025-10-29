"use client";

import { TaskUpdateAction } from "@actions/TaskUpdateAction";
import { TaskType } from "@app/tasks/components/fetch";
import { Input } from "@comps/SHADCN/ui/input";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import { cn } from "@shadcn/lib/utils";
import { startTransition, useState } from "react";
import useInstant from "./useInstant";

type InputUpdateTaskTitleProps = {
    task: TaskType;
    className?: string;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, className } = props;
    const { id, status } = task;

    const { setData, setOptimisticData } = useInstant(task);

    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title.length === 0) return setTitle(task.title);

        startTransition(async () => {
            // New item
            const newItem: TaskType = { id, title, status };

            // Set optimistic state
            setOptimisticData(newItem);

            // Do mutation
            const { data, error } = await TaskUpdateAction({ id, title });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!data || error) return console.log("❌ Update failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() => setData(data));

            console.log("✅ Update succeeded");
        });
    };

    return (
        <form action={handleTitleUpdate} className="w-full">
            <Input
                aria-label="Tâche"
                onBlur={handleTitleUpdate}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={className}
                autoComplete="off"
            />
        </form>
    );
}

type InputUpdateTaskTitleSkeletonProps = {
    className?: string;
    index?: number;
};

export const InputUpdateTaskTitleSkeleton = (props: InputUpdateTaskTitleSkeletonProps) => {
    const { className } = props;

    return <Skeleton className={cn("h-9 w-full rounded-none border-x-0 border-t-transparent", className)} />;
};
