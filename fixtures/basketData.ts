import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";

export const insertBaskets = async () => {
    try {
        for (const basket of basketData) {
            await PrismaInstance.basket.create({ data: basket });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des baskets -> " + (error as Error).message);
    }
};

const basketData: Prisma.BasketCreateInput[] = [
    // Basket 1 pour le user (4 fruits différents)
    {
        User: { connect: { email: "user@example.com" } },
        Quantity: {
            create: [
                { quantity: 3, Fruit: { connect: { name: "Pomme" } } },
                { quantity: 2, Fruit: { connect: { name: "Banane" } } },
                { quantity: 5, Fruit: { connect: { name: "Kiwi" } } },
                { quantity: 1, Fruit: { connect: { name: "Orange" } } },
            ],
        },
    },
    // Basket 2 pour le user (3 fruits différents)
    {
        User: { connect: { email: "user@example.com" } },
        Quantity: {
            create: [
                { quantity: 4, Fruit: { connect: { name: "Fraise" } } },
                { quantity: 2, Fruit: { connect: { name: "Raisin" } } },
                { quantity: 3, Fruit: { connect: { name: "Cerise" } } },
            ],
        },
    },
    // Basket 3 pour le user (5 fruits différents)
    {
        User: { connect: { email: "user@example.com" } },
        Quantity: {
            create: [
                { quantity: 1, Fruit: { connect: { name: "Mangue" } } },
                { quantity: 2, Fruit: { connect: { name: "Ananas" } } },
                { quantity: 3, Fruit: { connect: { name: "Poire" } } },
                { quantity: 4, Fruit: { connect: { name: "Pomme" } } },
                { quantity: 5, Fruit: { connect: { name: "Banane" } } },
            ],
        },
    },
    // Basket 1 pour le admin (4 fruits différents)
    {
        User: { connect: { email: "admin@example.com" } },
        Quantity: {
            create: [
                { quantity: 2, Fruit: { connect: { name: "Mangue" } } },
                { quantity: 3, Fruit: { connect: { name: "Ananas" } } },
                { quantity: 1, Fruit: { connect: { name: "Kiwi" } } },
                { quantity: 4, Fruit: { connect: { name: "Orange" } } },
            ],
        },
    },
    // Basket 2 pour le admin (5 fruits différents)
    {
        User: { connect: { email: "admin@example.com" } },
        Quantity: {
            create: [
                { quantity: 5, Fruit: { connect: { name: "Fraise" } } },
                { quantity: 1, Fruit: { connect: { name: "Cerise" } } },
                { quantity: 2, Fruit: { connect: { name: "Raisin" } } },
                { quantity: 3, Fruit: { connect: { name: "Poire" } } },
                { quantity: 4, Fruit: { connect: { name: "Pomme" } } },
            ],
        },
    },
];
