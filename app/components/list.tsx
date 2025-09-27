"use client";

import { useContext } from "react";
import { Context } from "./context";
import TodoItem from "./todoItem";

export default function List() {
    const { optimisticData } = useContext(Context);

    return (
        <div className="space-y-2">
            {optimisticData.map((task) => (
                <TodoItem key={task.id} task={task} />
            ))}
        </div>
    );
}
