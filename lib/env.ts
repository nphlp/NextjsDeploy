// Import from process.env
const NODE_ENV = process.env.NODE_ENV;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Throw errors if missing
if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

// Export environment variables
export const baseUrl = NEXT_PUBLIC_BASE_URL;
export const isDev = NODE_ENV === "development";
export const isProd = NODE_ENV === "production";
