"use client";

import { Context } from "@app/tasks/components/context";
import { Button } from "@comps/SHADCN/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@comps/SHADCN/ui/dialog";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import oRPC from "@lib/orpc";
import { cn } from "@shadcn/lib/utils";
import { Trash2 } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { startTransition, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { TaskType } from "./types";

type SelectUpdateTaskStatusProps = {
    task: TaskType;
    className?: string;
    redirectTo?: Route;
};

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, className, redirectTo } = props;

    // This context may be undefined if used outside of a provider
    const setDataBypass = useContext(Context)?.setDataBypass;
    const setOptimisticData = useContext(Context)?.setOptimisticData;
    const optimisticMutations = useContext(Context)?.optimisticMutations;

    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
        startTransition(async () => {
            // Set optimistic state
            if (setOptimisticData) setOptimisticData({ type: "delete", newItem: task });

            try {
                // Do mutation
                const data = await oRPC.task.delete({ id: task.id });

                // Close modal
                setIsModalOpen(false);

                // If redirection is defined, do not need updating state
                if (redirectTo) {
                    setTimeout(() => {
                        router.push(redirectTo);
                    }, 200);
                }

                // If success, update the real state in a new transition to prevent key conflict
                if (!redirectTo) {
                    startTransition(async () =>
                        setDataBypass((current) => optimisticMutations(current, { type: "delete", newItem: data })),
                    );
                }

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
