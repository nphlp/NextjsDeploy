"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [subject, setSubject] = useQueryState("subject", queryParams.subject);

    return { subject, setSubject };
}
