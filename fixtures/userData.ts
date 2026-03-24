import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";
import { hashPassword } from "better-auth/crypto";
import { randomBytes } from "node:crypto";

const isProd = process.env.NODE_ENV === "production";

export const insertUsers = async () => {
    try {
        // Production: generate a random password (shown only once in logs)
        // Development: use default password "Password1234!"
        const password = isProd ? randomBytes(16).toString("base64url") : null;
        const hashedPassword = password ? await hashPassword(password) : defaultPasswordHash;

        for (const user of userData) {
            await PrismaInstance.user.create({
                data: {
                    ...user,
                    Accounts: {
                        create: { providerId: "credential", accountId: "", password: hashedPassword },
                    },
                },
            });
        }

        if (password) {
            console.log("");
            console.log("🔑 Generated credentials (shown only once):");
            for (const user of userData) {
                console.log(`   ${user.role?.padEnd(5)} | ${user.email} | ${password}`);
            }
            console.log("");
        }
    } catch (error) {
        throw new Error("❌ Error creating users -> " + (error as Error).message);
    }
};

// Pre-hashed "Password1234!" for development
const defaultPasswordHash =
    "90e263724fdae11e158546bb8fe3e245:aa3cff1d8e5069c3697e8ea9e9adcfc6106b1f9abd31ebbf571843316cc48a21b289926b37b1ae55866a366fec84ed4fbe7af8ad9af66fa4c2977a694a13fdb1";

export const userData: Prisma.UserCreateInput[] = [
    {
        name: "Admin",
        lastname: "Debug",
        email: "admin@example.com",
        emailVerified: true,
        role: "ADMIN",
        Accounts: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPasswordHash,
            },
        },
    },
    {
        name: "User",
        lastname: "Debug",
        email: "user@example.com",
        emailVerified: true,
        role: "USER",
        Accounts: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPasswordHash,
            },
        },
    },
];
