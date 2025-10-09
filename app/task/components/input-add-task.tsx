"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { ArrowUp } from "lucide-react";
import { startTransition, useContext, useState } from "react";
import { AddTask } from "@/actions/TaskAction";
import { Context } from "./context";
import { TaskType } from "./fetch";

export default function InputAddTask() {
    const { setDataBypass, setOptimisticData, optimisticMutations } = useContext(Context);

    const [title, setTitle] = useState("");

    const handleSubmit = async () => {
        if (!title) return console.log("✏️ Input is empty");

        // Clear input
        setTitle("");

        startTransition(async () => {
            // New item (only title is important, id and status will be set by the server)
            const newItem: TaskType = { id: "", title, status: "TODO" };

            // Set optimistic state
            setOptimisticData({ type: "add", newItem });

            // Do mutation
            const validatedItem = await AddTask({ title: newItem.title });

            // If failed, the optimistic state is rolled back at the end of the transition
            if (!validatedItem) return console.log("❌ Creation failed");

            // If success, update the real state in a new transition to prevent key conflict
            startTransition(() =>
                setDataBypass((current) => optimisticMutations(current, { type: "add", newItem: validatedItem })),
            );

            console.log("✅ Creation succeeded");
        });
    };

    return (
        <form action={handleSubmit} className="flex w-full items-center gap-2">
            <Input
                label="Ajouter une tâche"
                placeholder="Ajouter une tâche"
                autoComplete="off"
                setValue={setTitle}
                value={title}
                className={{
                    component: "w-full",
                }}
                noLabel
            />
            <Button type="submit" label="Ajouter" variant="outline" className={{ button: "p-1.5" }}>
                <ArrowUp className="size-6" />
            </Button>
        </form>
    );
}

export function InputAddTaskSkeleton() {
    return (
        <div className="flex w-full items-center gap-2">
            <SkeletonContainer>
                <SkeletonText width="170px" />
            </SkeletonContainer>
            <SkeletonContainer className="w-fit px-2" noShrink>
                <SkeletonText width="20px" noShrink />
            </SkeletonContainer>
        </div>
    );
}
