"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [email] = useQueryState("email", queryParams.email);

    return { email };
}
