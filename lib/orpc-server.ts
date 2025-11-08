import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import "server-only";
import { appRouter } from "../api/router";

globalThis.$client = createRouterClient(appRouter, {
    context: async () => ({
        headers: await headers(),
    }),
});
