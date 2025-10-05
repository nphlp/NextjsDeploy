"use client";

import { SkeletonText } from "@comps/UI/skeleton";
import { NotebookPen } from "lucide-react";
import { useContext } from "react";
import { Context } from "./context";
import Item, { ItemSkeleton } from "./item";

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

    const todoTasks = optimisticData.filter((task) => task.status === "TODO");
    const inProgressTasks = optimisticData.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = optimisticData.filter((task) => task.status === "DONE");

    return (
        <div className="space-y-8">
            {!!todoTasks.length && (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold">À faire</h2>
                    {todoTasks.map((task) => (
                        <Item key={task.id} task={task} />
                    ))}
                </div>
            )}

            {!!inProgressTasks.length && (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold">En cours</h2>
                    {inProgressTasks.map((task) => (
                        <Item key={task.id} task={task} />
                    ))}
                </div>
            )}

            {!!doneTasks.length && (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold">Terminées</h2>
                    {doneTasks.map((task) => (
                        <Item key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}

export const ListSkeleton = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <SkeletonText width="120px" />
                {Array.from({ length: 3 }).map((_, index) => (
                    <ItemSkeleton key={index} index={index} />
                ))}
            </div>

            <div className="space-y-2">
                <SkeletonText width="120px" />
                {Array.from({ length: 3 }).map((_, index) => (
                    <ItemSkeleton key={index} index={index} />
                ))}
            </div>

            <div className="space-y-2">
                <SkeletonText width="120px" />
                {Array.from({ length: 3 }).map((_, index) => (
                    <ItemSkeleton key={index} index={index} />
                ))}
            </div>
        </div>
    );
};
