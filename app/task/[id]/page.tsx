import Link from "@comps/UI/button/link";
import { getSession } from "@lib/authServer";
import { TaskFindUniqueServer } from "@services/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import Edition, { EditionSkeleton } from "./components/edition";
import { taskIdPageParams } from "./components/fetch";

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

    const session = await getSession();
    if (!session) redirect("/login");

    const task = await TaskFindUniqueServer(taskIdPageParams(id, session));

    if (!task) notFound();

    return <Edition task={task} />;
};

const TaskSkeleton = () => {
    return <EditionSkeleton />;
};
