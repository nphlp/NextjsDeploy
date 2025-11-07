import "server-only";
import SolidRouter from "./solid";
import { solidServerReMapper } from "./solid-remappers";
import { SolidClientType, SolidServerType } from "./solid-types";

/**
 * Server-side client
 * Executes services directly without HTTP requests
 *
 * Loaded via instrumentation.ts at startup
 * Populates globalThis.$solidClient for SSR usage
 */
const SolidServer: SolidServerType = solidServerReMapper(SolidRouter);

// Populate global for SSR
// This allows solid-client.ts to use the direct service calls during SSR
globalThis.$solidClient = SolidServer as unknown as SolidClientType;

export default SolidServer;
