import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import "server-only";
import { appRouter } from "./orpc-router";

globalThis.$client = createRouterClient(appRouter, {
    context: async () => ({
        headers: await headers(),
    }),
});
