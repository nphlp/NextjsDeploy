import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";

export const insertFruits = async () => {
    try {
        for (const fruit of fruitData) {
            await PrismaInstance.fruit.create({
                data: fruit,
            });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des fruits -> " + (error as Error).message);
    }
};

const fruitData: Prisma.FruitCreateInput[] = [
    // Admin fruits
    {
        name: "Pomme",
        description: "Fruit croquant et juteux, riche en fibres",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Banane",
        description: "Fruit tropical énergétique, riche en potassium",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Orange",
        description: "Agrume vitaminé, excellente source de vitamine C",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Fraise",
        description: "Petit fruit rouge sucré et parfumé",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Kiwi",
        description: "Fruit exotique à chair verte acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    // User fruits
    {
        name: "Mangue",
        description: "Fruit tropical sucré à la chair onctueuse",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Raisin",
        description: "Petites baies juteuses en grappe",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Ananas",
        description: "Fruit tropical à la chair dorée et acidulée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Poire",
        description: "Fruit doux et fondant de la famille des pommes",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Cerise",
        description: "Petit fruit rouge à noyau, doux et sucré",
        User: { connect: { email: "user@example.com" } },
    },
];
