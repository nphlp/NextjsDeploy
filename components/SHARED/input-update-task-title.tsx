"use client";

import Input, { InputClassName } from "@comps/UI/input/input";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UpdateTask } from "@/actions/Task";

type InputUpdateTaskTitleProps = {
    task: TaskModel;
    refetch: RefetchType;
    className?: InputClassName;
    autoFocus?: boolean;
    autoRedirection?: boolean;
};

export default function InputUpdateTaskTitle(props: InputUpdateTaskTitleProps) {
    const { task, refetch, className, autoFocus = false, autoRedirection = false } = props;
    const { slug } = task;

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(task.title);

    const handleTitleUpdate = async () => {
        if (title === task.title) return;
        if (!title.length && refetch) return refetch();
        focusBlink();
        const newTask = await UpdateTask({ slug, title });
        if (autoRedirection && newTask) return router.push(`/task/${newTask.slug}`);
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
                autoFocus={autoFocus}
                noLabel
                // Disable autocomplete
                autoComplete="off"
                data-1p-ignore
                data-lpignore
                data-protonpass-ignore
            />
        </form>
    );
}
