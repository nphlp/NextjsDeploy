"use client";

import Input, { InputClassName } from "@comps/UI/input/input";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { useRef, useState } from "react";
import { UpdateTask } from "@/actions/Task";

type InputUpdateTaskTitleProps = {
    task: TaskModel;
    refetch?: RefetchType;
    className?: InputClassName;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, refetch, className } = props;
    const { id } = task;

    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title === task.title) return;
        if (!title.length && refetch) return refetch();
        focusBlink();
        UpdateTask({ id, title });
    };

    // For Enter key press
    const focusBlink = () => {
        inputRef.current?.classList.add("ring-transparent");
        setTimeout(() => {
            inputRef.current?.classList.remove("ring-transparent");
        }, 100);
    };

    return (
        <form action={handleTitleUpdate} className="w-full">
            <Input
                ref={inputRef}
                label="Tâche"
                onBlur={handleTitleUpdate}
                setValue={setTitle}
                value={title}
                className={className}
                noLabel
                autoComplete="off"
            />
        </form>
    );
}
