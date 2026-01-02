import SearchFilter, { SearchFilterSkeleton } from "@comps/SHARED/filters/search-filter";
import UpdatedAtFilter, { UpdatedAtFilterSkeleton } from "@comps/SHARED/filters/updated-at-filter";
import InputAddTask, { InputAddTaskSkeleton } from "@comps/SHARED/optimistics/input-add-task";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import List, { ListSkeleton } from "./_components/list";
import Provider from "./_components/provider";
import { taskQueryParamsCached } from "./_components/queryParams";

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    return (
        <Main className="items-stretch justify-start">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-8">
                <Suspense fallback={<TodoSkeleton />}>
                    <Todo {...props} />
                </Suspense>
            </section>
        </Main>
    );
}

const Todo = async (props: PageProps) => {
    "use cache: private";

    const params = taskQueryParamsCached.parse(await props.searchParams);

    const { updatedAt, search } = params;

    const session = await getSession();
    if (!session) redirect("/login");

    const taskList = await oRPC.task.findMany({ updatedAt, search, userId: session.user.id });

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
