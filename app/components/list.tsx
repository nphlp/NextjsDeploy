"use client";

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

    return (
        <div className="space-y-2">
            {optimisticData.map((task) => (
                <Item key={task.id} task={task} />
            ))}
        </div>
    );
}

export const ListSkeleton = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 9 }).map((_, index) => (
                <ItemSkeleton key={index} index={index} />
            ))}
        </div>
    );
};
