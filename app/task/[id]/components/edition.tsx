"use client";

import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import ButtonDeleteTask, { ButtonDeleteTaskSkeleton } from "@comps/SHARED/optimistics/button-delete-task";
import InputUpdateTaskTitle, { InputUpdateTaskTitleSkeleton } from "@comps/SHARED/optimistics/input-update-task-title";
import SelectUpdateTaskStatus, {
    SelectUpdateTaskStatusSkeleton,
} from "@comps/SHARED/optimistics/select-update-task-status";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { TaskType } from "./fetch";

type EditionProps = {
    task: TaskType;
};

export default function Edition(props: EditionProps) {
    const { task } = props;

    const formattedDate = dayjs(task.updatedAt).locale("fr").format("D MMM YYYY à HH[h]mm et  ss[s]");

    return (
        <div className="space-y-4">
            <InputUpdateTaskTitle
                task={task}
                className="w-full rounded-none border-x-0 border-t-transparent px-0 py-1 text-lg focus:border-t-transparent focus:ring-0"
            />
            <div className="flex justify-between gap-2">
                <SelectUpdateTaskStatus task={task} className="w-full" />
                <ButtonDeleteTask task={task} className="px-1.5" redirectTo="/tasks" />
            </div>
            <div className="flex items-end gap-2 text-gray-500">
                <div className="text-xs font-extrabold uppercase">Mis à jour</div>
                <div className="text-sm">{formattedDate}</div>
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
            <div>
                <Skeleton className="h-4 w-[60%]" />
            </div>
        </div>
    );
};
