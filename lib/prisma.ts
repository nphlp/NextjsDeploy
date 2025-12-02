import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/client";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL environment variable is not defined");

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prismaClientSingleton = () => new PrismaClient({ adapter });

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

/**
 * A singleton instance of the Prisma client to prevent
 * multiple instances of the Prisma client from being created.
 */
const PrismaInstance = globalThis.prismaGlobal ?? prismaClientSingleton();

export default PrismaInstance;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = PrismaInstance;
