"use client";

import Button, { ButtonClassName } from "@comps/UI/button/button";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { X } from "lucide-react";
import { DeleteTask } from "@/actions/Task";

type SelectUpdateTaskStatusProps = {
    task: TaskModel;
    refetch: RefetchType;
    className?: ButtonClassName;
};

export default function ButtonDeleteTask(props: SelectUpdateTaskStatusProps) {
    const { task, refetch, className } = props;
    const { id } = task;

    const handleDelete = async () => {
        await DeleteTask({ id });
        refetch();
    };

    return (
        <Button label={`Status ${task.status}`} variant="outline" className={className} onClick={handleDelete}>
            <X />
        </Button>
    );
}
