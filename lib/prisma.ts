import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/client";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const IS_PROD = process.env.NODE_ENV === "production";
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL environment variable is not defined");

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

/**
 * A singleton instance of the Prisma client to prevent
 * multiple instances of the Prisma client from being created.
 */
const PrismaInstance = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (!IS_PROD) globalForPrisma.prisma = PrismaInstance;

export default PrismaInstance;
