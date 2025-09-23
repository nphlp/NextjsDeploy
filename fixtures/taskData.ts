import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { stringToSlug } from "@utils/stringToSlug";

export const insertTasks = async () => {
    try {
        for (const data of taskData) {
            await PrismaInstance.task.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des tasks -> " + (error as Error).message);
    }
};

export const taskData: Prisma.TaskCreateInput[] = [
    {
        title: "Cuisiner avec des ingrédients de saison",
        slug: stringToSlug("Cuisiner avec des ingrédients de saison"),
        status: "DONE",
        Author: {
            connect: {
                email: "admin@example.com",
            },
        },
    },
    {
        title: "Arroser le basilic",
        slug: stringToSlug("Arroser le basilic"),
        status: "IN_PROGRESS",
        Author: {
            connect: {
                email: "admin@example.com",
            },
        },
    },
    {
        title: "Construire une cabane en bois",
        slug: stringToSlug("Construire une cabane en bois"),
        status: "TODO",
        Author: {
            connect: {
                email: "admin@example.com",
            },
        },
    },
    {
        title: "Réduire son empreinte carbone",
        slug: stringToSlug("Réduire son empreinte carbone"),
        status: "IN_PROGRESS",
        Author: {
            connect: {
                email: "user@example.com",
            },
        },
    },
    {
        title: "Aller au marché local",
        slug: stringToSlug("Aller au marché local"),
        status: "TODO",
        Author: {
            connect: {
                email: "user@example.com",
            },
        },
    },
];
