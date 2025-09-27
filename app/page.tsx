import { TaskFindManyServer } from "@services/server";
import AddTodoItem from "./components/addTodoItem";
import Provider from "./components/provider";
import TodoList from "./components/todoList";

export const dynamic = "force-dynamic";

export default async function Home() {
    const taskList = await TaskFindManyServer({ orderBy: { updatedAt: "desc" } });

    return (
        <div className="w-full max-w-[900px] space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-4">
                <Provider initialData={taskList}>
                    <AddTodoItem />
                    <hr className="border-gray-low mx-2" />
                    <TodoList />
                </Provider>
            </section>
        </div>
    );
}
