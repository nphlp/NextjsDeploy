import Link from "@comps/UI/button/link";
import { TaskFindUniqueServer } from "@services/server";
import { notFound } from "next/navigation";
import Form from "./components/form";
import Provider from "./components/provider";

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
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <Provider initialData={task}>
                <Form />
            </Provider>
            <Link label="Retour à la liste" href="/" />
        </div>
    );
}
