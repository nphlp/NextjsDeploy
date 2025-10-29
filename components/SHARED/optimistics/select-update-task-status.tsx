"use client";

import { TaskUpdateAction } from "@actions/TaskUpdateAction";
import { TaskType } from "@app/tasks/components/fetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comps/SHADCN/ui/select";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import { cn } from "@shadcn/lib/utils";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { ReactNode, startTransition } from "react";
import useInstant from "./useInstant";

type SelectOptionType = {
    slug: string;
    label: ReactNode;
};

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
    className?: string;
};

export default function SelectUpdateTaskStatus(props: SelectUpdateTaskStatusProps) {
    const { task, className } = props;
    const { id, title } = task;

    const { optimisticData, setData, setOptimisticData } = useInstant(task);

    const handleStatusUpdate = (newStatus: string) => {
        const newStatusConst = newStatus as TaskType["status"];
        startTransition(async () => {
            // New item
            const newItem: TaskType = { id, title, status: newStatusConst };

            // Set optimistic state
            setOptimisticData(newItem);

            // Do mutation
            const { data, error } = await TaskUpdateAction({ id, status: newStatusConst });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!data || error) return console.log("❌ Update failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() => setData(data));

            console.log("✅ Update succeeded");
        });
    };

    return (
        <Select value={optimisticData.status} onValueChange={handleStatusUpdate}>
            <SelectTrigger className={className} aria-label="Update status">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.slug} value={option.slug}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

type SelectUpdateTaskStatusSkeletonProps = {
    className?: string;
    index?: number;
    noShrink?: boolean;
};

export const SelectUpdateTaskStatusSkeleton = (props: SelectUpdateTaskStatusSkeletonProps) => {
    const { className } = props;

    return <Skeleton className={cn("h-9 w-[150px]", className)} />;
};
