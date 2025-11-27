"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comps/SHADCN/ui/select";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import oRPC from "@lib/orpc";
import { cn } from "@shadcn/lib/utils";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { ReactNode, startTransition } from "react";
import { toast } from "sonner";
import { TaskType } from "./types";
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
            const updatedItem: TaskType = { id, title, status: newStatusConst };

            // Set optimistic state
            setOptimisticData(updatedItem);

            try {
                // Do mutation
                const data = await oRPC.task.update({ id, status: newStatusConst });

                // If success, update the real state in a new transition to prevent key conflict
                startTransition(() => setData(data));

                toast.success("Statut mis à jour avec succès");
            } catch (error) {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.error((error as Error).message ?? "Impossible de mettre à jour le statut");
            }
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
