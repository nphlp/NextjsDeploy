import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";

export const insertUsers = async () => {
    try {
        for (const data of userData) {
            await PrismaInstance.user.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des utilisateurs -> " + (error as Error).message);
    }
};

const defaultPassword =
    "90e263724fdae11e158546bb8fe3e245:aa3cff1d8e5069c3697e8ea9e9adcfc6106b1f9abd31ebbf571843316cc48a21b289926b37b1ae55866a366fec84ed4fbe7af8ad9af66fa4c2977a694a13fdb1"; // Password1234!

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
                password: defaultPassword,
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
                password: defaultPassword,
            },
        },
    },
];
