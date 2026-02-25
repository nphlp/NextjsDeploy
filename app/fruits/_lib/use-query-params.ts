"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [order, setOrder] = useQueryState("order", queryParams.order);
    const [page, setPage] = useQueryState("page", queryParams.page);
    const [search, setSearch] = useQueryState("search", queryParams.search);

    return {
        order,
        setOrder,
        page,
        setPage,
        search,
        setSearch,
    };
}
