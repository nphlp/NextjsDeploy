import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const isStandalone = process.env.NEXTJS_STANDALONE === "true";

const nextConfig: NextConfig = {
    // Build output mode
    output: isStandalone ? "standalone" : undefined,

    // Directory for tracing files in standalone mode
    outputFileTracingRoot: __dirname,

    // Typed routes for links
    typedRoutes: true,

    experimental: {
        // View transition API
        viewTransition: true,

        // Unauthorized redirection support
        authInterrupts: true,

        // UseCache, cacheLife and cacheTag
        useCache: true,

        // Turbopack persistent caching
        turbopackPersistentCaching: true,
    },
};

export default nextConfig;
