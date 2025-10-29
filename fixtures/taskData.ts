import PrismaInstance from "@lib/prisma";
import { $Enums } from "@prisma/client";

export const insertTasks = async () => {
    try {
        const userList = await PrismaInstance.user.findMany();

        for (const user of userList) {
            await PrismaInstance.task.createMany({ data: taskData.map((task) => ({ ...task, userId: user.id })) });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des tasks -> " + (error as Error).message);
    }
};

type TaskData = {
    title: string;
    status: $Enums.Status;
};

const taskData: TaskData[] = [
    { title: "Cuisiner avec des ingrédients de saison", status: "DONE" },
    { title: "Installer les panneaux solaires", status: "DONE" },
    { title: "Composter les déchets organiques", status: "DONE" },
    { title: "Arroser le basilic", status: "IN_PROGRESS" },
    { title: "Réduire son empreinte carbone", status: "IN_PROGRESS" },
    { title: "Apprendre le jardinage biologique", status: "IN_PROGRESS" },
    { title: "Construire une cabane en bois", status: "TODO" },
    { title: "Aller au marché local", status: "TODO" },
    { title: "Créer un potager urbain", status: "TODO" },
];
