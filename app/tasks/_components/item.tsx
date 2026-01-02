import ButtonDeleteTask, { ButtonDeleteTaskSkeleton } from "@comps/SHARED/optimistics/button-delete-task";
import InputUpdateTaskTitle, { InputUpdateTaskTitleSkeleton } from "@comps/SHARED/optimistics/input-update-task-title";
import SelectUpdateTaskStatus, {
    SelectUpdateTaskStatusSkeleton,
} from "@comps/SHARED/optimistics/select-update-task-status";
import { TaskType } from "@comps/SHARED/optimistics/types";
import Link from "@comps/atoms/button/link";
import Skeleton from "@comps/atoms/skeleton";
import { Pencil } from "lucide-react";
import { Route } from "next";

type TodoItemProps = {
    task: TaskType;
};

export default function Item(props: TodoItemProps) {
    const { task } = props;

    return (
        <div className="flex flex-row gap-2">
            <InputUpdateTaskTitle
                task={task}
                className="w-full rounded-none border-x-0 border-t-transparent px-0 focus:border-t-transparent focus:ring-0"
            />
            <SelectUpdateTaskStatus task={task} className="w-[150px] shrink-0 max-md:hidden" />
            <Link label={`Edit ${task.title}`} colors="outline" href={`/task/${task.id}` as Route} className="px-1.5">
                <Pencil className="size-6" />
            </Link>
            <ButtonDeleteTask task={task} className="max-xs:hidden px-1.5" />
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
            <SelectUpdateTaskStatusSkeleton index={index} className="w-[150px] max-md:hidden" />
            <Skeleton className="h-9 w-9 shrink-0" />
            <ButtonDeleteTaskSkeleton className="max-xs:hidden" />
        </div>
    );
}
