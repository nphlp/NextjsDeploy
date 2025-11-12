import PrismaInstance from "@lib/prisma";

export const insertFruits = async () => {
    try {
        for (const fruit of fruitData) {
            await PrismaInstance.fruit.create({ data: fruit });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des fruits -> " + (error as Error).message);
    }
};

type FruitData = {
    name: string;
    description?: string;
};

const fruitData: FruitData[] = [
    { name: "Pomme", description: "Fruit croquant et juteux, riche en fibres" },
    { name: "Banane", description: "Fruit tropical énergétique, riche en potassium" },
    { name: "Orange", description: "Agrume vitaminé, excellente source de vitamine C" },
    { name: "Fraise", description: "Petit fruit rouge sucré et parfumé" },
    { name: "Kiwi", description: "Fruit exotique à chair verte acidulée" },
    { name: "Mangue", description: "Fruit tropical sucré à la chair onctueuse" },
    { name: "Raisin", description: "Petites baies juteuses en grappe" },
    { name: "Ananas", description: "Fruit tropical à la chair dorée et acidulée" },
    { name: "Poire", description: "Fruit doux et fondant de la famille des pommes" },
    { name: "Cerise", description: "Petit fruit rouge à noyau, doux et sucré" },
];
