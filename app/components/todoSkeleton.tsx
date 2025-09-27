import { AddTodoSkeleton } from "./addTodo";
import { TodoItemSkeleton } from "./todoItem";

export default async function TodoSkeleton() {
    return (
        <>
            <AddTodoSkeleton />
            <hr className="border-gray-low mx-2" />
            <div className="space-y-2">
                {Array.from({ length: 5 }, (_, index) => (
                    <TodoItemSkeleton key={index} index={index} />
                ))}
            </div>
        </>
    );
}
