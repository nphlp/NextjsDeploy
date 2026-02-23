"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [order, setOrder] = useQueryState("order", queryParams.order);
    const [take, setTake] = useQueryState("take", queryParams.take);
    const [search, setSearch] = useQueryState("search", queryParams.search);

    return {
        order,
        setOrder,
        take,
        setTake,
        search,
        setSearch,
    };
}
