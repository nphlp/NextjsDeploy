"use client";

import ButtonDeleteTask, { ButtonDeleteTaskSkeleton } from "@comps/SHARED/button-delete-task";
import InputUpdateTaskTitle, { InputUpdateTaskTitleSkeleton } from "@comps/SHARED/input-update-task-title";
import SelectUpdateTaskStatus, { SelectUpdateTaskStatusSkeleton } from "@comps/SHARED/select-update-task-status";
import { TaskType } from "./fetch";

type EditionProps = {
    task: TaskType;
};

export default function Edition(props: EditionProps) {
    const { task } = props;

    return (
        <div className="space-y-4">
            <InputUpdateTaskTitle
                task={task}
                className={{
                    component: "w-full",
                    input: "rounded-none border-x-0 border-t-transparent px-0 py-1 text-lg focus:border-t-transparent focus:ring-0",
                }}
            />
            <div className="flex justify-between gap-2">
                <SelectUpdateTaskStatus task={task} className={{ component: "w-full" }} />
                <ButtonDeleteTask task={task} className={{ button: "px-1.5" }} redirectTo="/" />
            </div>
        </div>
    );
}

export const EditionSkeleton = () => {
    return (
        <div className="space-y-4">
            <InputUpdateTaskTitleSkeleton />
            <div className="flex justify-between gap-2">
                <SelectUpdateTaskStatusSkeleton />
                <ButtonDeleteTaskSkeleton />
            </div>
        </div>
    );
};
