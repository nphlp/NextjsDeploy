import { createRouterClient } from "@orpc/server";
import "server-only";
import { appRouter } from "../api/router";

globalThis.$client = createRouterClient(appRouter, {
    context: async () => ({
        // Prevent using dynamic values that break Nextjs "Full Routing Caching"
        // Authentifcation cookies is managed by `/api/auth` Better Auth route
        // headers: await headers(),
    }),
});
