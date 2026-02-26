"use client";

import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import FruitCard, { FruitCardSkeleton } from "@organisms/fruit-card";
import { Fruit } from "@prisma/client/client";
import { PackageOpen } from "lucide-react";
import { useEffect, useRef } from "react";
import { ITEMS_PER_PAGE } from "../_lib/query-params";
import { useQueryParams } from "../_lib/use-query-params";
import Pagination, { PaginationSkeleton } from "./pagination";

type FruitsGridProps = {
    initialData: (Fruit & { inBasketCount: number })[];
    initialTotalCount: number;
};

export default function FruitsGrid(props: FruitsGridProps) {
    const { initialData, initialTotalCount } = props;

    const isFirstRender = useRef(true);

    const { order, page, setPage, search } = useQueryParams();

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const { data: fruits, isFetching: isFetchingFruits } = useFetch({
        client: oRPC.fruit.findMany,
        args: {
            searchByName: search || undefined,
            orderByName: order,
            take: ITEMS_PER_PAGE,
            skip,
        },
        keys: [order, page, search],
        initialData,
        debounce: 250,
    });

    const { data: totalCount } = useFetch({
        client: oRPC.fruit.count,
        args: {
            searchByName: search || undefined,
        },
        keys: [search],
        initialData: initialTotalCount,
        debounce: 250,
    });

    const totalPages = Math.ceil((totalCount ?? 0) / ITEMS_PER_PAGE);

    // Reset page to 1 when search or order changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPage(1);
    }, [search, order, setPage]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    // Loading state
    if (isFetchingFruits) {
        return <FruitsGridSkeleton />;
    }

    // Empty state
    if (!fruits?.length) {
        return (
            <section className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-600">
                <PackageOpen className="size-12 stroke-[1.4px]" />
                <p className="text-lg font-medium">No fruits found...</p>
            </section>
        );
    }

    return (
        <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fruits.map((fruit) => (
                    <FruitCard key={fruit.id} fruit={fruit} />
                ))}
            </section>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
    );
}

export const FruitsGridSkeleton = () => {
    return (
        <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 11 }).map((_, index) => (
                    <FruitCardSkeleton key={index} />
                ))}
            </section>
            <PaginationSkeleton />
        </>
    );
};
