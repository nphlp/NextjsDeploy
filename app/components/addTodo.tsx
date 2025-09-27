"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { combo } from "@lib/combo";
import { ArrowUp } from "lucide-react";
import { startTransition, useContext, useState } from "react";
import { AddTask } from "@/actions/Task";
import { Context } from "./context";
import { TaskType } from "./fetch";

export default function AddTodo() {
    const { setData, setOptimisticData, optimisticMutations } = useContext(Context);

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
                setData((current) => optimisticMutations(current, { type: "add", newItem: validatedItem })),
            );

            console.log("✅ Creation succeeded");
        });
    };

    return (
        <form action={handleSubmit} className="flex items-center gap-2">
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
                <ArrowUp />
            </Button>
        </form>
    );
}

export function AddTodoSkeleton() {
    return (
        <div className="flex w-full items-center gap-2">
            <div
                className={combo(
                    "relative h-[38px] w-full px-4",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    className={combo(
                        "h-5 w-[25%]",
                        "relative top-1/2 -translate-y-1/2",
                        "bg-gray-low animate-pulse rounded",
                    )}
                />
            </div>
            <div
                className={combo(
                    "max-xs:hidden",
                    "relative size-[38px] shrink-0",
                    "text-foreground bg-background border-gray-low animate-pulse rounded-lg border",
                )}
            >
                <div
                    className={combo(
                        "size-5",
                        "relative top-1/2 left-1/2 -translate-1/2",
                        "bg-gray-low animate-pulse rounded",
                    )}
                />
            </div>
        </div>
    );
}
