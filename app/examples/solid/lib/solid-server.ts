import Solid from "./solid";
import { solidServerReMapper } from "./solid-remappers";

const SolidServer = solidServerReMapper(Solid);

/**
 * Server side
 * Execute service functions directly
 * Bypassing fetch requests
 *
 * SolidServer = {
 *     user: {
 *         list: executeService(input: Input) => Promise<Output>,
 *         get: executeService(input: Input) => Promise<Output>,
 *     },
 *     task: {
 *         list: executeService(input: Input) => Promise<Output>,
 *         get: executeService(input: Input) => Promise<Output>,
 *     },
 * }
 */
export default SolidServer;
