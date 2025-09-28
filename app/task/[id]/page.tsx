import Link from "@comps/UI/button/link";
import { TaskFindUniqueServer } from "@services/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import Edition, { EditionSkeleton } from "./components/edition";
import { taskIdPageParams } from "./components/fetch";
import Provider from "./components/provider";

type Params = {
    id: string;
};

const paramsSchema: ZodType<Params> = z.strictObject({ id: z.nanoid() });

type PageProps = {
    params: Promise<Params>;
};

export default async function Page(props: PageProps) {
    const { params } = props;

    const { id } = paramsSchema.parse(await params);

    return (
        <div className="w-full max-w-[600px] space-y-6 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Édition de la tâche 📝</h1>
            <Suspense fallback={<TaskSkeleton />}>
                <Task id={id} />
            </Suspense>
            <Link label="Retour" href="/" />
        </div>
    );
}

type TaskProps = Params;

const Task = async (props: TaskProps) => {
    const { id } = props;

    const task = await TaskFindUniqueServer(taskIdPageParams(id));

    if (!task) notFound();

    return (
        <Provider initialData={task}>
            <Edition />
        </Provider>
    );
};

const TaskSkeleton = () => {
    return <EditionSkeleton />;
};
