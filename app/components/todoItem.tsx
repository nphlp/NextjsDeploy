"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { TaskModel } from "@services/types";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { useState } from "react";

type TodoItemProps = {
    task: TaskModel;
};

export default function TodoItem(props: TodoItemProps) {
    const { task } = props;

    const [title, setTitle] = useState(task.title);

    return (
        <div className="flex items-center gap-2">
            <Input
                label={`Task ${task.title}`}
                autoComplete="off"
                setValue={setTitle}
                value={title}
                className={{ input: "text-foreground bg-background border-gray-low" }}
                noLabel
            />
            <Button
                label={`Status ${task.status}`}
                variant="outline"
                className={{ button: "bg-background text-foreground border-gray-low px-1.5" }}
            >
                {task.status === "TODO" && <CircleCheckBig />}
                {task.status === "IN_PROGRESS" && <LoaderCircle />}
                {task.status === "DONE" && <CircleDashed />}
            </Button>
        </div>
    );
}
