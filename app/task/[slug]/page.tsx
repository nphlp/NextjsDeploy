import Link from "@comps/UI/button/link";
import { TaskFindManyServer, TaskFindUniqueServer } from "@services/server";
import { CircleCheckBig, CircleDashed, LoaderCircle } from "lucide-react";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
    const articles = await TaskFindManyServer({
        select: { slug: true },
    });

    return articles.map((article) => ({ slug: article.slug }));
};

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;
    const { slug } = await params;

    const task = await TaskFindUniqueServer({ where: { slug } });

    if (!task) notFound();

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex items-center gap-4">
                <span>Status: </span>
                <span className="flex items-center gap-2 font-bold">
                    {task.status === "TODO" && (
                        <>
                            <CircleDashed className="size-4" />
                            <span>À faire</span>
                        </>
                    )}
                    {task.status === "IN_PROGRESS" && (
                        <>
                            <LoaderCircle className="size-4" />
                            <span>En cours</span>
                        </>
                    )}
                    {task.status === "DONE" && (
                        <>
                            <CircleCheckBig className="size-4" />
                            <span>Terminé</span>
                        </>
                    )}
                </span>
            </div>
            <Link label="Retour à la liste" href="/" />
        </div>
    );
}
