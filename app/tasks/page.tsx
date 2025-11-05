import SearchFilter, { SearchFilterSkeleton } from "@comps/SHARED/filters/search-filter";
import UpdatedAtFilter, { UpdatedAtFilterSkeleton } from "@comps/SHARED/filters/updated-at-filter";
import InputAddTask, { InputAddTaskSkeleton } from "@comps/SHARED/optimistics/input-add-task";
import { getSession } from "@lib/authServer";
import { TaskFindManyServer } from "@services/server";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { taskPageParams } from "./components/fetch";
import List, { ListSkeleton } from "./components/list";
import Provider from "./components/provider";
import { taskQueryParamsCached } from "./components/queryParams";

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    return (
        <div className="w-full max-w-[900px] space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-8">
                <Suspense fallback={<TodoSkeleton />}>
                    <Todo {...props} />
                </Suspense>
            </section>
        </div>
    );
}

const Todo = async (props: PageProps) => {
    "use cache: private";

    const params = taskQueryParamsCached.parse(await props.searchParams);

    const { updatedAt, search } = params;

    const session = await getSession();
    if (!session) redirect("/login");

    const taskList = await TaskFindManyServer(taskPageParams({ updatedAt, search, userId: session.user.id }));

    return (
        <Provider initialData={taskList} sessionServer={session}>
            <InputAddTask />
            <div className="grid grid-cols-2 gap-4">
                <UpdatedAtFilter />
                <SearchFilter />
            </div>
            <List />
        </Provider>
    );
};

const TodoSkeleton = () => {
    return (
        <>
            <InputAddTaskSkeleton />
            <div className="grid grid-cols-2 gap-4">
                <UpdatedAtFilterSkeleton />
                <SearchFilterSkeleton />
            </div>
            <ListSkeleton />
        </>
    );
};
