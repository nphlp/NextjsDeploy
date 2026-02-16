"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [tab, setTab] = useQueryState("tab", queryParams.tab);

    return {
        tab,
        setTab,
    };
}
