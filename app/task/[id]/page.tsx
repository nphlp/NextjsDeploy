import Link from "@comps/atoms/button/link";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import Edition, { EditionSkeleton } from "./_components/edition";

type Params = {
    id: string;
};

const paramsSchema: ZodType<Params> = z.strictObject({ id: z.nanoid() });

type PageProps = {
    params: Promise<Params>;
};

export default async function Page(props: PageProps) {
    return (
        <Main>
            <div className="w-full max-w-120 space-y-6">
                <h1 className="text-2xl font-bold">Édition de la tâche 📝</h1>
                <Suspense fallback={<TaskSkeleton />}>
                    <Task {...props} />
                </Suspense>
                <Link label="Retour" href="/tasks">
                    Retour
                </Link>
            </div>
        </Main>
    );
}

const Task = async (props: PageProps) => {
    "use cache: private";

    const { id } = paramsSchema.parse(await props.params);

    const session = await getSession();
    if (!session) redirect("/login");

    const task = await oRPC.task.findUnique({ id });

    if (!task) notFound();

    return <Edition task={task} />;
};

const TaskSkeleton = () => {
    return <EditionSkeleton />;
};
