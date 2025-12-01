import { Suspense } from "react";
import FruitDetail, { FruitDetailSkeleton } from "./_components/fruit-detail";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;

    const { id } = await params;

    return (
        <div className="w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 sm:px-12">
            <Suspense fallback={<FruitDetailSkeleton />}>
                <FruitDetail id={id} />
            </Suspense>
        </div>
    );
}
