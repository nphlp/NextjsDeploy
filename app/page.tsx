// import { TaskFindManyServer } from "@services/server";
// import AddTodoItem from "./components/addTodoItem";
// import Provider from "./components/provider";
// import TodoList from "./components/todoList";

export default async function Home() {
    // const taskList = await TaskFindManyServer({ orderBy: { updatedAt: "desc" } });

    return (
        <div className="w-full space-y-4 p-4 sm:w-3/4 md:w-2/3">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            {/* <Provider initialData={taskList}>
                <section className="space-y-4">
                    <AddTodoItem />
                    <hr className="border-gray-low mx-2" />
                    <TodoList />
                </section>
            </Provider> */}
        </div>
    );
}
