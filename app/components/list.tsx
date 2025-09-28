"use client";

import { useContext } from "react";
import { Context } from "./context";
import Item, { ItemSkeleton } from "./item";

export default function List() {
    const { optimisticData } = useContext(Context);

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
            {Array.from({ length: 5 }).map((_, index) => (
                <ItemSkeleton key={index} index={index} />
            ))}
        </div>
    );
};
