"use client";

import { useContext } from "react";
import { Context } from "./context";
import TodoItem from "./todoItem";
import TodoListSkeleton from "./todoListSkeleton";

export default function TodoList() {
    const { data, isLoading } = useContext(Context);

    if (isLoading) {
        return <TodoListSkeleton number={data?.length} />;
    }

    return (
        <div className="space-y-2">
            {data?.map((task) => (
                <TodoItem key={task.id} task={task} />
            ))}
        </div>
    );
}
