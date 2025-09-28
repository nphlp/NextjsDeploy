"use client";

import { Context } from "@app/components/context";
import { TaskType } from "@app/components/fetch";
import Select, { SelectClassName } from "@comps/UI/select/select";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { combo } from "@lib/combo";
import { TaskModel } from "@services/types";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { startTransition, useContext, useState } from "react";
import { UpdateTask } from "@/actions/Task";

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

type SelectUpdateTaskStatusProps = {
    task: TaskType;
    className?: SelectClassName;
};

export default function SelectUpdateTaskStatus(props: SelectUpdateTaskStatusProps) {
    const { task, className } = props;
    const { id, title } = task;

    const { setData, setOptimisticData, optimisticMutations } = useContext(Context);

    const [status, setStatus] = useState<string>(task.status);

    const handleStatusUpdate = async () => {
        startTransition(async () => {
            // New item
            const newItem: TaskType = { id, title, status: status as TaskModel["status"] };

            // Set optimistic state
            setOptimisticData({ type: "update", newItem });

            // Do mutation
            const validatedItem = await UpdateTask({ id, status });

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
        <Select
            label="Update status"
            className={className}
            onSelectChange={handleStatusUpdate}
            setSelected={setStatus}
            selected={status}
            options={options}
            canNotBeEmpty
            noLabel
        />
    );
}

type SelectUpdateTaskStatusSkeletonProps = {
    className?: string;
    index?: number;
};

export const SelectUpdateTaskStatusSkeleton = (props: SelectUpdateTaskStatusSkeletonProps) => {
    const { index = 0, className } = props;

    return (
        <SkeletonContainer className={combo("flex w-[150px] gap-3 pr-2 pl-3", className)} noShrink>
            <SkeletonText index={index} />
            <SkeletonText width="20px" noShrink />
        </SkeletonContainer>
    );
};
