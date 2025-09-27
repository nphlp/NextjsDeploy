import { TodoItemSkeleton } from "./todoItem";

type TodoListSkeletonProps = {
    number?: number;
};

export default function TodoListSkeleton(props: TodoListSkeletonProps) {
    const { number } = props;

    const length = number ?? 5;

    return (
        <div className="space-y-2">
            {Array.from({ length }, (_, index) => (
                <TodoItemSkeleton key={index} index={index} />
            ))}
        </div>
    );
}
