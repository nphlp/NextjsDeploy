import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const isStandalone = process.env.NEXTJS_STANDALONE === "true"

const nextConfig: NextConfig = {
    output: isStandalone ? "standalone" : undefined,
    outputFileTracingRoot: __dirname,
};

export default nextConfig;
