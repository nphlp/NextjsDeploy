import { TaskFindManyServer } from "@services/server";
import TodoList from "./components/todoList";

export default async function Home() {
    const taskList = await TaskFindManyServer({});

    return (
        <main className="">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
                <TodoList taskList={taskList} />
            </div>
        </main>
    );
}
