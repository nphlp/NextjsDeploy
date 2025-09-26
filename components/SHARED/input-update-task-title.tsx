"use client";

import Input, { InputClassName } from "@comps/UI/input/input";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { useRef, useState } from "react";
import { UpdateTask } from "@/actions/Task";

type InputUpdateTaskTitleProps = {
    task: TaskModel;
    refetch: RefetchType;
    className?: InputClassName;
    autoFocus?: boolean;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, refetch, className, autoFocus = false } = props;
    const { slug } = task;

    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title === task.title) return;
        if (!title.length) return refetch();
        focusBlink();
        await UpdateTask({ slug, title });
    };

    // For Entrer key press
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
                autoComplete="off"
                onBlur={handleTitleUpdate}
                setValue={setTitle}
                value={title}
                className={className}
                autoFocus={autoFocus}
                noLabel
            />
        </form>
    );
}
