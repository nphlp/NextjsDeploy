"use client";

import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import FruitCard, { FruitCardSkeleton } from "@organisms/fruit-card";
import { Fruit } from "@prisma/client/client";
import { PackageOpen } from "lucide-react";
import { useQueryParams } from "../_lib/use-query-params";

type FruitsGridProps = {
    initialData: (Fruit & { inBasketCount: number })[];
};

export default function FruitsGrid(props: FruitsGridProps) {
    const { initialData } = props;
    const { order, take, search } = useQueryParams();

    const { data: fruits, isFetching } = useFetch({
        client: oRPC.fruit.findMany,
        args: {
            searchByName: search || undefined,
            orderByName: order,
            take: take ?? undefined,
        },
        keys: [order, take, search],
        initialData,
        debounce: 250,
    });

    if (isFetching) {
        return <FruitsGridSkeleton />;
    }

    if (!fruits?.length) {
        return (
            <section className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-600">
                <PackageOpen className="size-12 stroke-[1.4px]" />
                <p className="text-lg font-medium">No fruits found...</p>
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fruits?.map((fruit) => (
                <FruitCard key={fruit.id} fruit={fruit} />
            ))}
        </section>
    );
}

export const FruitsGridSkeleton = () => {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 11 }).map((_, index) => (
                <FruitCardSkeleton key={index} />
            ))}
        </section>
    );
};
