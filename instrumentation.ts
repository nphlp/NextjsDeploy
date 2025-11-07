export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./app/examples/orpc/lib/orpc-server");
        await import("./app/examples/solid/lib/solid-server");
    }
}
