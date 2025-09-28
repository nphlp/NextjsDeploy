"use client";

import ButtonDeleteTask, { ButtonDeleteTaskSkeleton } from "@comps/SHARED/button-delete-task";
import InputUpdateTaskTitle, { InputUpdateTaskTitleSkeleton } from "@comps/SHARED/input-update-task-title";
import SelectUpdateTaskStatus, { SelectUpdateTaskStatusSkeleton } from "@comps/SHARED/select-update-task-status";
import { TaskType } from "./fetch";

type TodoItemProps = {
    task: TaskType;
};

export default function Item(props: TodoItemProps) {
    const { task } = props;

    return (
        <div className="flex flex-row gap-2">
            <InputUpdateTaskTitle
                task={task}
                className={{
                    component: "w-full",
                    input: "rounded-none border-x-0 border-t-transparent px-0 focus:border-t-transparent focus:ring-0",
                }}
            />
            <SelectUpdateTaskStatus task={task} className={{ component: "w-[150px] shrink-0 max-md:hidden" }} />
            {/* <Link label={`Edit ${task.title}`} variant="outline" href={`/task/${task.id}` as Route} className="px-1.5">
                <Pencil />
            </Link> */}
            <ButtonDeleteTask task={task} className={{ button: "max-xs:hidden px-1.5" }} />
        </div>
    );
}

type TodoItemSkeletonProps = {
    index: number;
};

export function ItemSkeleton(props: TodoItemSkeletonProps) {
    const { index } = props;

    return (
        <div className="flex w-full items-center gap-2">
            <InputUpdateTaskTitleSkeleton index={index} />
            <SelectUpdateTaskStatusSkeleton index={index} className="max-md:hidden" />
            <ButtonDeleteTaskSkeleton className="max-xs:hidden" />
        </div>
    );
}
