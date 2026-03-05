"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [redirect] = useQueryState("redirect", queryParams.redirect);
    return { redirect };
}
