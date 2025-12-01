import { Suspense } from "react";
import FruitsGrid, { FruitsGridSkeleton } from "./_components/fruit-grid";

type PageProps = {
    searchParams: Promise<{ take?: string }>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const { take } = await searchParams;

    return (
        <div className="w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Fruits</h1>
            <Suspense fallback={<FruitsGridSkeleton />}>
                <FruitsGrid take={take} />
            </Suspense>
        </div>
    );
}
