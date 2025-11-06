import Solid from "./solid";
import { solidClientReMapper } from "./solid-remappers";

const SolidClient = await solidClientReMapper(Solid);

/**
 * Client side
 * Generate fetcher functions for each route
 * Fetch API endpoints, through SolidHandler
 *
 * SolidServer = {
 *     user: {
 *         list: fetcher(input: Input) => Promise<Output>,
 *         get: fetcher(input: Input) => Promise<Output>,
 *     },
 *     task: {
 *         list: fetcher(input: Input) => Promise<Output>,
 *         get: fetcher(input: Input) => Promise<Output>,
 *     },
 * }
 */
export default SolidClient;
