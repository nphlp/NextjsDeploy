import { Suspense } from "react";
import Todo from "./components/todo";
import TodoSkeleton from "./components/todoSkeleton";

export const dynamic = "force-dynamic";

export default async function Home() {
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
