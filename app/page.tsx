import InputAddTask, { InputAddTaskSkeleton } from "@app/components/input-add-task";
import SearchFilter, { SearchFilterSkeleton } from "@comps/SHARED/filters/SearchFilter";
import UpdatedAtFilter, { UpdatedAtFilterSkeleton } from "@comps/SHARED/filters/UpdatedAtFilter";
import { TaskFindManyServer } from "@services/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { homePageParams } from "./components/fetch";
import List, { ListSkeleton } from "./components/list";
import Provider from "./components/provider";
import { HomeQueryParamsCachedType, homeQueryParamsCached } from "./components/queryParams";

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const params = await homeQueryParamsCached.parse(searchParams);

    return (
        <div className="w-full max-w-[900px] space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Ma liste de tâches 📝</h1>
            <section className="space-y-4">
                <Suspense fallback={<TodoSkeleton />}>
                    <Todo params={params} />
                </Suspense>
            </section>
        </div>
    );
}

type TodoProps = {
    params: HomeQueryParamsCachedType;
};

const Todo = async (props: TodoProps) => {
    const { params } = props;
    const { updatedAt, search } = params;

    const taskList = await TaskFindManyServer(homePageParams({ updatedAt, search }));

    return (
        <Provider initialData={taskList}>
            <InputAddTask />
            <hr className="border-gray-low" />
            <div className="grid grid-cols-2 gap-4">
                <UpdatedAtFilter />
                <SearchFilter />
            </div>
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
            <div className="grid grid-cols-2 gap-4">
                <UpdatedAtFilterSkeleton />
                <SearchFilterSkeleton />
            </div>
            <hr className="border-gray-low" />
            <ListSkeleton />
        </>
    );
};
