"use client";

import { NotebookPen } from "lucide-react";
import { useContext } from "react";
import { Context } from "./context";
import SectionStatus, { SectionStatusSkeleton } from "./section-status";

export default function List() {
    const { optimisticData } = useContext(Context);

    if (!optimisticData?.length) {
        return (
            <div className="flex items-center justify-center gap-4 py-8 text-lg">
                <span>Aucune tâche...</span>
                <NotebookPen className="size-5 -translate-y-[2px]" />
            </div>
        );
    }

    // Split tasks by status
    const todoTasks = optimisticData.filter((task) => task.status === "TODO");
    const inProgressTasks = optimisticData.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = optimisticData.filter((task) => task.status === "DONE");

    return (
        <div className="space-y-8">
            <SectionStatus title="À faire" tasks={todoTasks} />
            <SectionStatus title="En cours" tasks={inProgressTasks} />
            <SectionStatus title="Terminé" tasks={doneTasks} />
        </div>
    );
}

export const ListSkeleton = () => {
    return (
        <div className="space-y-8">
            <SectionStatusSkeleton />
            <SectionStatusSkeleton />
            <SectionStatusSkeleton />
        </div>
    );
};
