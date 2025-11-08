import Link from "@comps/SHADCN/components/link";
import { getSession } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import Edition, { EditionSkeleton } from "./components/edition";

type Params = {
    id: string;
};

const paramsSchema: ZodType<Params> = z.strictObject({ id: z.nanoid() });

type PageProps = {
    params: Promise<Params>;
};

export default async function Page(props: PageProps) {
    return (
        <div className="w-full max-w-[600px] space-y-6 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Édition de la tâche 📝</h1>
            <Suspense fallback={<TaskSkeleton />}>
                <Task {...props} />
            </Suspense>
            <Link aria-label="Retour" href="/">
                Retour
            </Link>
        </div>
    );
}

const Task = async (props: PageProps) => {
    "use cache: private";

    const { id } = paramsSchema.parse(await props.params);

    const session = await getSession();
    if (!session) redirect("/login");

    // const task = await TaskFindUniqueServer(taskIdPageParams(id, session));

    const task = await oRPC.task.get({ id });

    if (!task) notFound();

    return <Edition task={task} />;
};

const TaskSkeleton = () => {
    return <EditionSkeleton />;
};
