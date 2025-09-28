import InputAddTask, { InputAddTaskSkeleton } from "@comps/SHARED/input-add-task";
import { TaskFindManyServer } from "@services/server";
import { Suspense } from "react";
import { homePageParams } from "./components/fetch";
import List, { ListSkeleton } from "./components/list";
import Provider from "./components/provider";

export default async function Page() {
    return (
        <div className="w-full max-w-[900px] space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-4">
                <Suspense fallback={<TodoSkeleton />}>
                    <Todo />
                </Suspense>
            </section>
        </div>
    );
}

const Todo = async () => {
    const taskList = await TaskFindManyServer(homePageParams());

    return (
        <Provider initialData={taskList}>
            <InputAddTask />
            <hr className="border-gray-low" />
            <List />
        </Provider>
    );
};

const TodoSkeleton = () => {
    return (
        <>
            <InputAddTaskSkeleton />
            <hr className="border-gray-low" />
            <ListSkeleton />
        </>
    );
};
