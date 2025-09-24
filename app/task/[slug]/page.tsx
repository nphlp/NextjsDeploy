import { TaskFindUniqueServer } from "@services/server";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;
    const { slug } = await params;

    const task = await TaskFindUniqueServer({ where: { slug } });

    return (
        <div className="w-full space-y-4 p-4 sm:w-3/4 md:w-2/3">
            <h1 className="text-2xl font-bold">{slug}</h1>
            <div>
                <span>Title: </span>
                <span>{task?.title}</span>
            </div>
            <div>
                <span>Status: </span>
                <span>{task?.status}</span>
            </div>
        </div>
    );
}
