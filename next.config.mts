import bundleAnalyzer from "@next/bundle-analyzer";
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

    // Enable React memoryzing compiler
    // reactCompiler: true,

    experimental: {
        // View transition API
        viewTransition: true,

        // Unauthorized redirection support
        authInterrupts: true,

        // UseCache, cacheLife and cacheTag
        useCache: true,

        // Turbopack persistent caching
        turbopackFileSystemCacheForDev: true,
    },
};

const bundleAnalyzerWrapper = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfigExport = bundleAnalyzerWrapper(nextConfig);

export default nextConfigExport;
