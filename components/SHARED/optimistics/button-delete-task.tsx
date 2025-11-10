"use client";

import { TaskType } from "@app/tasks/components/fetch";
import { Button } from "@comps/SHADCN/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@comps/SHADCN/ui/dialog";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import oRPC from "@lib/orpc";
import { cn } from "@shadcn/lib/utils";
import { Trash2 } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { RefetchType } from "@/solid/solid-hook";
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

            try {
                // Do mutation
                const data = await oRPC.task.delete({ id: newItem.id });

                // If success, update the real state in a new transition to prevent key conflict
                startTransition(() => setData(data));

                // If redirection or refetching, do it after the real state change
                if (redirectTo) router.push(redirectTo);
                if (refetch) refetch();

                toast.success("Tâche supprimée avec succès");
            } catch (error) {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.error((error as Error).message ?? "Impossible de supprimer la tâche");
            }
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
