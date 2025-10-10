import { TaskFindManyServer } from "@services/server";
import Card from "./card";
import { exampleBouncyHeightResizerPageParams } from "./fetch";

export const dynamic = "force-dynamic";

export default async function Page() {
    const taskList = await TaskFindManyServer({
        ...exampleBouncyHeightResizerPageParams(),
        take: 3,
    });

    return (
        <div className="flex-1 p-7">
            <Card initialData={taskList} />
        </div>
    );
}
