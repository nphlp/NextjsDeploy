"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { ArrowUp } from "lucide-react";
import { useContext, useState } from "react";
import { AddTask } from "@/actions/Task";
import { Context } from "./context";

export default function AddTodoItem() {
    const [title, setTitle] = useState("");

    const { refetch } = useContext(Context);

    const handleSubmit = async () => {
        await AddTask({ title });
        setTitle("");
        refetch();
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
                    input: "text-foreground bg-background border-gray-low",
                }}
                noLabel
                autoFocus
            />
            <Button
                type="submit"
                label="Ajouter"
                variant="outline"
                className={{ button: "bg-background text-foreground border-gray-low p-1.5" }}
            >
                <ArrowUp />
            </Button>
        </form>
    );
}
