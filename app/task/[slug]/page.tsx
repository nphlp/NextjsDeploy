import Link from "@comps/UI/button/link";
import { TaskFindUniqueServer } from "@services/server";
import { notFound } from "next/navigation";
import Provider from "./components/provider";
import TodoEdition from "./components/todoEdition";

// export const generateStaticParams = async () => {
//     const articles = await TaskFindManyServer({
//         select: { slug: true },
//     });

//     return articles.map((article) => ({ slug: article.slug }));
// };

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;
    const { slug } = await params;

    const task = await TaskFindUniqueServer({ where: { slug } });

    if (!task) notFound();

    return (
        <div className="w-full max-w-[600px] space-y-8 px-4 py-4 sm:px-12">
            <Provider initialData={task}>
                <TodoEdition />
            </Provider>
            <Link label="Retour à la liste" href="/" />
        </div>
    );
}
