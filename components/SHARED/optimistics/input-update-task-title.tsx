"use client";

import { useToast } from "@atoms/toast";
import Input from "@comps/atoms/input/input";
import Skeleton from "@comps/atoms/skeleton";
import cn from "@lib/cn";
import oRPC from "@lib/orpc";
import { ChangeEvent, startTransition, useRef, useState } from "react";
import { TaskType } from "./types";
import useInstant from "./useInstant";

type InputUpdateTaskTitleProps = {
    task: TaskType;
    className?: string;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, className } = props;
    const { id, status } = task;
    const toast = useToast();

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
                const data = await oRPC.task.update({ id, title });

                // If success, update the real state in a new transition to prevent key conflict
                startTransition(() => setData(data));

                // Update previous title
                previousTitle.current = title;

                toast.add({
                    title: "Titre modifié",
                    description: "Les modifications ont été enregistrées.",
                    type: "success",
                });
            } catch {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.add({ title: "Erreur", description: "Impossible de modifier le titre.", type: "error" });
            }
        });
    };

    return (
        <form action={handleTitleUpdate} className="w-full">
            <Input
                className={className}
                onBlur={handleTitleUpdate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
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
