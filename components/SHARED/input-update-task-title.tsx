"use client";

import { Context } from "@app/components/context";
import { TaskType } from "@app/components/fetch";
import Input, { InputClassName } from "@comps/UI/input/input";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { combo } from "@lib/combo";
import { startTransition, useContext, useState } from "react";
import { UpdateTask } from "@/actions/Task";

type InputUpdateTaskTitleProps = {
    task: TaskType;
    className?: InputClassName;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, className } = props;
    const { id, status } = task;

    const { setData, setOptimisticData, optimisticMutations } = useContext(Context);

    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title.length === 0) return setTitle(task.title);

        startTransition(async () => {
            // New item
            const newItem: TaskType = { id, title, status };

            // Set optimistic state
            setOptimisticData({ type: "update", newItem });

            // Do mutation
            const validatedItem = await UpdateTask({ id, title });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!validatedItem) return console.log("❌ Update failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() =>
                setData((current) => optimisticMutations(current, { type: "update", newItem: validatedItem })),
            );

            console.log("✅ Update succeeded");
        });
    };

    return (
        <form action={handleTitleUpdate} className="w-full">
            <Input
                label="Tâche"
                onBlur={handleTitleUpdate}
                setValue={setTitle}
                value={title}
                className={className}
                noLabel
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
    const { index = 0, className } = props;

    return (
        <SkeletonContainer className={combo("rounded-none border-x-0 border-t-transparent px-0", className)}>
            <SkeletonText minWidth={30} maxWidth={60} index={index} />
        </SkeletonContainer>
    );
};
