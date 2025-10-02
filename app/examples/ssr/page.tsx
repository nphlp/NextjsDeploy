import SearchFilter from "@comps/SHARED/filters/SearchFilter";
import UpdatedAtFilter from "@comps/SHARED/filters/UpdatedAtFilter";
import { TaskFindManyServer } from "@services/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ButtonRefetch from "./components/button-refetch";
import { exampleSrrPageParams } from "./components/fetch";
import List from "./components/list";
import Provider from "./components/provider";
import { ExampleSrrQueryParamsCachedType, exampleSrrQueryParamsCached } from "./components/queryParams";

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const params = await exampleSrrQueryParamsCached.parse(searchParams);

    return (
        <div className="space-y-4 p-7">
            <Suspense>
                <Data searchParams={params} />
            </Suspense>
        </div>
    );
}

type DataProps = {
    searchParams: ExampleSrrQueryParamsCachedType;
};

const Data = async (props: DataProps) => {
    const { searchParams } = props;
    const { updatedAt, search } = searchParams;

    const taskList = await TaskFindManyServer(exampleSrrPageParams({ updatedAt, search }));

    return (
        <Provider initialData={taskList}>
            <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-3">
                <UpdatedAtFilter />
                <SearchFilter />
                <ButtonRefetch />
            </div>
            <List />
        </Provider>
    );
};
