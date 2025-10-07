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
        title: "Installer les panneaux solaires",
        slug: stringToSlug("Installer les panneaux solaires"),
        status: "DONE",
        Author: {
            connect: {
                email: "admin@example.com",
            },
        },
    },
    {
        title: "Composter les déchets organiques",
        slug: stringToSlug("Composter les déchets organiques"),
        status: "DONE",
        Author: {
            connect: {
                email: "user@example.com",
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
        title: "Apprendre le jardinage biologique",
        slug: stringToSlug("Apprendre le jardinage biologique"),
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
        title: "Aller au marché local",
        slug: stringToSlug("Aller au marché local"),
        status: "TODO",
        Author: {
            connect: {
                email: "user@example.com",
            },
        },
    },
    {
        title: "Créer un potager urbain",
        slug: stringToSlug("Créer un potager urbain"),
        status: "TODO",
        Author: {
            connect: {
                email: "user@example.com",
            },
        },
    },
];
