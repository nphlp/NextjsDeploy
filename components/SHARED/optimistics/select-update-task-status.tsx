"use client";

import { TaskType } from "@app/task/components/fetch";
import Select, { SelectClassName } from "@comps/UI/select/select";
import { SelectOptionType } from "@comps/UI/select/utils";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { combo } from "@lib/combo";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { startTransition, useState } from "react";
import { UpdateTask } from "@/actions/TaskAction";
import useInstant from "./useInstant";

const options: SelectOptionType[] = [
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

    const { setData, setOptimisticData } = useInstant(task);

    const [status, setStatus] = useState<string>(task.status);

    const handleStatusUpdate = (newStatus: string) => {
        const newStatusConst = newStatus as TaskType["status"];
        startTransition(async () => {
            // New item
            const newItem: TaskType = { id, title, status: newStatusConst };

            // Set optimistic state
            setOptimisticData(newItem);

            // Do mutation
            const validatedItem = await UpdateTask({ id, status: newStatusConst });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!validatedItem) return console.log("❌ Update failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() => setData(validatedItem));

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
    noShrink?: boolean;
};

export const SelectUpdateTaskStatusSkeleton = (props: SelectUpdateTaskStatusSkeletonProps) => {
    const { index = 0, className, noShrink = false } = props;

    return (
        <SkeletonContainer className={combo("flex gap-3 pr-2 pl-3", className)} noShrink={noShrink}>
            <SkeletonText index={index} />
            <SkeletonText width="20px" noShrink />
        </SkeletonContainer>
    );
};
