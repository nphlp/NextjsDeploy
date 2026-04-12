"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./success-query-params";

export function useSuccessQueryParams() {
    const [email] = useQueryState("email", queryParams.email);
    return { email };
}
