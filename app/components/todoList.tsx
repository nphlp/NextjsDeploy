"use client";

import { TaskModel } from "@services/types";
import TodoItem from "./todoItem";

type TodoListProps = {
    taskList: TaskModel[];
};

export default function TodoList(props: TodoListProps) {
    const { taskList } = props;

    return (
        <section className="space-y-2">
            {taskList.map((task) => (
                <TodoItem key={task.id} task={task} />
            ))}
        </section>
    );
}
