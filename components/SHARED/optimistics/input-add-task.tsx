"use client";

import { Context } from "@app/tasks/_components/context";
import { Button } from "@comps/SHADCN/ui/button";
import { Input } from "@comps/SHADCN/ui/input";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import oRPC from "@lib/orpc";
import { ArrowUp } from "lucide-react";
import { startTransition, useContext, useState } from "react";
import { toast } from "sonner";
import { TaskType } from "./types";

export default function InputAddTask() {
    const { setDataBypass, setOptimisticData, optimisticMutations } = useContext(Context);

    const [title, setTitle] = useState("");

    const handleSubmit = async () => {
        if (!title) {
            toast.error("Le titre ne peut pas être vide");
            return;
        }

        // Clear input
        setTitle("");

        startTransition(async () => {
            const newItem: TaskType = { id: "", title, status: "TODO" };

            // Set optimistic state
            setOptimisticData({ type: "add", newItem });

            try {
                // Do mutation
                const data = await oRPC.task.create({ title: newItem.title });

                // If success, update the real state in a new transition to prevent key conflict
                startTransition(() =>
                    setDataBypass((current) => optimisticMutations(current, { type: "add", newItem: data })),
                );

                toast.success("Création de la tâche réussie");
            } catch (error) {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.error((error as Error).message ?? "Impossible de créer de la tâche");
            }
        });
    };

    return (
        <form action={handleSubmit} className="flex w-full items-center gap-2">
            <Input
                aria-label="Ajouter une tâche"
                placeholder="Ajouter une tâche"
                autoComplete="off"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <Button type="submit" aria-label="Ajouter" variant="outline" className="p-1.5">
                <ArrowUp className="size-6" />
            </Button>
        </form>
    );
}

export function InputAddTaskSkeleton() {
    return (
        <div className="flex w-full items-center gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-9 shrink-0" />
        </div>
    );
}
