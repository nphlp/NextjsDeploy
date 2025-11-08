import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "../app/examples/orpc/api/router";

declare global {
    var $client: RouterClient<AppRouter> | undefined;
}

const link = new RPCLink({
    url: () => {
        if (typeof window === "undefined") {
            throw new Error("RPCLink is not allowed on the server side.");
        }

        return `${window.location.origin}/api/orpc`;
    },
});

const oRPC: RouterClient<AppRouter> = globalThis.$client ?? createORPCClient(link);

export default oRPC;
