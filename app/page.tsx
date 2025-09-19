import { TaskFindManyServer } from "@services/server";

export default async function Home() {
    const taskList = await TaskFindManyServer({});

    return (
        <main className="flex min-h-full flex-col items-center justify-center gap-6">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
                <ul className="space-y-2">
                    {taskList.map((task) => (
                        <li key={task.id} className="rounded-lg border border-gray-300 px-3 py-1">
                            {task.title}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
