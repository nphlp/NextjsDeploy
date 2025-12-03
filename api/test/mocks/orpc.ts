import { createRouterClient } from "@orpc/server";
import { apiRouter } from "../../router";

/**
 * Mock oRPC direct client
 * -> bypass HTTP layer
 * -> directly calls route handlers
 */
export const oRPC_bypass_http = createRouterClient(apiRouter, { context: async () => ({}) });
