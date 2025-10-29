"use client";

import { TaskDeleteAction } from "@actions/TaskDeleteAction";
import { TaskType } from "@app/tasks/components/fetch";
import { Button } from "@comps/SHADCN/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@comps/SHADCN/ui/dialog";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import { cn } from "@shadcn/lib/utils";
import { RefetchType } from "@utils/FetchHook";
import { Trash2 } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { startTransition, useRef, useState } from "react";
import useInstant from "./useInstant";

type SelectUpdateTaskStatusProps = {
    task: TaskType;
    className?: string;
} & (
    | {
          redirectTo: Route;
          refetch?: undefined;
      }
    | {
          redirectTo?: undefined;
          refetch?: RefetchType;
      }
);

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, className, redirectTo, refetch } = props;

    const router = useRouter();
    const { setData, setOptimisticData } = useInstant(task);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
        startTransition(async () => {
            // New item
            const newItem: TaskType = task;

            // Set optimistic state
            setOptimisticData(newItem);

            // Do mutation
            const { data, error } = await TaskDeleteAction({ id: newItem.id });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!data || error) return console.log("❌ Deletion failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() => setData(data));

            // If redirection or refetching, do it after the real state change
            if (redirectTo) router.push(redirectTo);
            if (refetch) refetch();

            console.log("✅ Deletion succeeded");
        });
    };

    return (
        <>
            <Button
                variant="outline"
                className={className}
                onClick={() => setIsModalOpen(true)}
                aria-label={`Delete ${task.title}`}
            >
                <Trash2 className="size-6" />
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[500px]">
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>Êtes-vous sûr de vouloir supprimer cette tâche ?</DialogDescription>
                    <div className="mt-4 flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button ref={buttonRef} variant="destructive" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

type ButtonDeleteTaskSkeletonProps = {
    className?: string;
};

export const ButtonDeleteTaskSkeleton = (props: ButtonDeleteTaskSkeletonProps) => {
    const { className } = props;

    return <Skeleton className={cn("h-9 w-9", className)} />;
};
