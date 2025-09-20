"use client";

import { useContext } from "react";
import { Context } from "./context";
import TodoItem, { TodoItemSkeleton } from "./todoItem";

export default function TodoList() {
    const { data, isLoading } = useContext(Context);

    if (isLoading) {
        const length = data?.length ?? 5;
        return (
            <div className="space-y-2">
                {Array.from({ length }, (_, index) => (
                    <TodoItemSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {data?.map((task) => (
                <TodoItem key={task.id} task={task} />
            ))}
        </div>
    );
}
