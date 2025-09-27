import Link from "@comps/UI/button/link";
import { TaskFindUniqueServer } from "@services/server";
import { notFound } from "next/navigation";
import TodoEdition from "./components/todoEdition";

// export const generateStaticParams = async () => {
//     const articles = await TaskFindManyServer({
//         select: { id: true },
//     });

//     return articles.map((article) => ({ id: article.id }));
// };

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;
    const { id } = await params;

    const task = await TaskFindUniqueServer({ where: { id } });

    if (!task) notFound();

    return (
        <div className="w-full max-w-[600px] space-y-8 px-4 py-4 sm:px-12">
            <TodoEdition task={task} />
            <Link label="Retour à la liste" href="/" />
        </div>
    );
}
