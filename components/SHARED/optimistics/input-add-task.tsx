"use client";

import { Context } from "@app/tasks/_components/context";
import { useToast } from "@atoms/toast";
import Button from "@comps/atoms/button/button";
import Input from "@comps/atoms/input/input";
import Skeleton from "@comps/atoms/skeleton";
import oRPC from "@lib/orpc";
import { ArrowUp } from "lucide-react";
import { ChangeEvent, startTransition, useContext, useState } from "react";
import { TaskType } from "./types";

export default function InputAddTask() {
    const { setDataBypass, setOptimisticData, optimisticMutations } = useContext(Context);
    const toast = useToast();

    const [title, setTitle] = useState("");

    const handleSubmit = async () => {
        if (!title) {
            toast.add({ title: "Erreur", description: "Le titre ne peut pas être vide.", type: "error" });
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

                toast.add({ title: "Tâche créée", description: "La tâche a été ajoutée à la liste.", type: "success" });
            } catch {
                // If failed, the optimistic state is rolled back at the end of the transition
                toast.add({ title: "Erreur", description: "Impossible de créer la tâche.", type: "error" });
            }
        });
    };

    return (
        <form action={handleSubmit} className="flex w-full items-center gap-2">
            <Input
                placeholder="Ajouter une tâche"
                autoComplete="off"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                value={title}
            />
            <Button type="submit" label="Ajouter" colors="outline" className="p-1.5">
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
