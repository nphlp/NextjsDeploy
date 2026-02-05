import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const isStandalone = process.env.NEXTJS_STANDALONE === "true";

// Security headers config
const securityHeaders = [
    // Prevent clickjacking attacks
    { key: "X-Frame-Options", value: "DENY" },
    // Prevent MIME type sniffing
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Prevent information leaks via the referrer URL
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Disable unused browser features
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // Specify authorized sources for content
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self'",
            "font-src 'self'",
        ].join("; "),
    },
];

const nextConfig: NextConfig = {
    // Build output mode
    output: isStandalone ? "standalone" : undefined,

    // Directory for tracing files in standalone mode
    outputFileTracingRoot: __dirname,

    // Typed routes for links
    typedRoutes: true,

    // Enable React memoising compiler
    reactCompiler: true,

    // New nextjs rendering method (every page is dynamic by default)
    // Directives: use cache, use cache private, use cache remote
    // Functions: cacheTag, cacheLife, revalidateTag, updateTag
    cacheComponents: true,

    // Transpile Scalar packages to handle Vue-style CSS
    transpilePackages: ["@scalar/api-reference-react", "@scalar/api-reference", "@scalar/agent-chat"],

    // Security headers
    headers: async () => [{ source: "/(.*)", headers: securityHeaders }],

    experimental: {
        // View transition API
        viewTransition: true,

        // Unauthorized redirection support
        authInterrupts: true,

        // Turbopack persistent caching
        turbopackFileSystemCacheForDev: true,
        turbopackFileSystemCacheForBuild: true,
    },
};

const bundleAnalyzerWrapper = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfigExport = bundleAnalyzerWrapper(nextConfig);

export default nextConfigExport;
