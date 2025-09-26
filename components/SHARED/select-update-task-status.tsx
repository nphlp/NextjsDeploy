"use client";

import Select, { SelectClassName } from "@comps/UI/select/select";
import { TaskModel } from "@services/types";
import { RefetchType } from "@utils/FetchHook";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { UpdateTask } from "@/actions/Task";

const options = [
    {
        slug: "TODO",
        label: (
            <div className="flex items-center gap-2">
                <CircleDashed className="size-4" />
                <span>À faire</span>
            </div>
        ),
    },
    {
        slug: "IN_PROGRESS",
        label: (
            <div className="flex items-center gap-2">
                <LoaderCircle className="size-4" />
                <span>En cours</span>
            </div>
        ),
    },
    {
        slug: "DONE",
        label: (
            <div className="flex items-center gap-2">
                <CircleCheckBig className="size-4" />
                <span>Terminé</span>
            </div>
        ),
    },
];

type SelectUpdateTaskStatusProps = {
    task: TaskModel;
    refetch: RefetchType;
    className?: SelectClassName;
};

export default function SelectUpdateTaskStatus(props: SelectUpdateTaskStatusProps) {
    const { task, refetch, className } = props;
    const { slug } = task;

    const [status, setStatus] = useState<string>(task.status);

    const handleStatusUpdate = async (statusChange: string) => {
        if (statusChange === task.status) return;
        await UpdateTask({ slug, status: statusChange });
        refetch();
    };

    return (
        <Select
            label="Update status"
            className={className}
            onSelectChange={handleStatusUpdate}
            setSelected={setStatus}
            selected={status}
            options={options}
            canNotBeEmpty
            noLabel
        />
    );
}
