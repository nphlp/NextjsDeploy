import { createSolidClient } from "./solid-proxy";
import type { SolidClientType } from "./solid-types";

// Declare global type for TypeScript
declare global {
    var $solidClient: SolidClientType | undefined;
}

/**
 * Solid Client
 *
 * On server (SSR): Uses globalThis.$solidClient (direct service calls)
 * On browser: Creates a Proxy-based client (fetch requests)
 *
 * The type is inferred from SolidRouterType via "import type"
 * No runtime import of server-only code!
 */
export const SolidClient: SolidClientType = globalThis.$solidClient ?? createSolidClient();

export default SolidClient;
