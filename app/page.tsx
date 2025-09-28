import { TaskFindManyServer } from "@services/server";
import InputAddTask from "../components/SHARED/input-add-task";
import { tasksParams } from "./components/fetch";
import List from "./components/list";
import Provider from "./components/provider";

export const dynamic = "force-dynamic";

export default async function Home() {
    const taskList = await TaskFindManyServer(tasksParams());

    return (
        <div className="w-full max-w-[900px] space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-4">
                <Provider initialData={taskList}>
                    <InputAddTask />
                    <hr className="border-gray-low" />
                    <List />
                </Provider>
            </section>
        </div>
    );
}
