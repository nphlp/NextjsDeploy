"use client";

import { Input } from "@comps/SHADCN/ui/input";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import oRPC from "@lib/orpc";
import { cn } from "@shadcn/lib/utils";
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { TaskType } from "./types";
import useInstant from "./useInstant";

type InputUpdateTaskTitleProps = {
    task: TaskType;
    className?: string;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, className } = props;
    const { id, status } = task;

    const { setData, setOptimisticData } = useInstant(task);

    const previousTitle = useRef<string>(task.title);
    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title.length === 0) return setTitle(previousTitle.current);
        if (title === previousTitle.current) return;

        startTransition(async () => {
            // New item
            const updatedItem: TaskType = { id, title, status };

            // Set optimistic state
            setOptimisticData(updatedItem);

            try {
                // Do mutation
                const data = await oRPC.task.update({ id, title, revalidatePaths: ["/tasks", `/task/${id}`] });

                // If success, update the real state in a new transition to prevent key conflict
                startTransition(() => setData(data));

                // Update previous title
                previousTitle.current = title;

                toast.success("Titre mis à jour avec succès");
            } catch (error) {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.error((error as Error).message ?? "Impossible de mettre à jour le titre");
            }
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
