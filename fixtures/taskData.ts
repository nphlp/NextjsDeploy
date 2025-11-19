import PrismaInstance from "@lib/prisma";
import { $Enums } from "@prisma/client/client";

export const insertTasks = async () => {
    try {
        const userList = await PrismaInstance.user.findMany();

        userList.map(async (user, index) => {
            const taskList = (index + 1) % 2 === 0 ? taskData : taskData2;

            for (const task of taskList) {
                await PrismaInstance.task.create({ data: { ...task, userId: user.id } });
            }
        });
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des tasks -> " + (error as Error).message);
    }
};

type TaskData = {
    title: string;
    status: $Enums.Status;
};

const taskData: TaskData[] = [
    { title: "Apprendre TypeScript avancé", status: "DONE" },
    { title: "Optimiser les performances de l'application", status: "DONE" },
    { title: "Écrire des tests unitaires", status: "DONE" },
    { title: "Mettre en place l'intégration continue", status: "IN_PROGRESS" },
    { title: "Refactoriser le module d'authentification", status: "IN_PROGRESS" },
    { title: "Documenter l'API publique", status: "IN_PROGRESS" },
    { title: "Ajouter la pagination aux listes", status: "TODO" },
    { title: "Améliorer l'accessibilité", status: "TODO" },
    { title: "Déployer la version stable", status: "TODO" },
];

const taskData2: TaskData[] = [
    { title: "Planifier la roadmap produit", status: "DONE" },
    { title: "Analyser les retours utilisateurs", status: "DONE" },
    { title: "Corriger les bugs critiques", status: "DONE" },
    { title: "Mettre à jour les dépendances", status: "IN_PROGRESS" },
    { title: "Réduire la dette technique", status: "IN_PROGRESS" },
    { title: "Créer des pages d'aide", status: "IN_PROGRESS" },
    { title: "Localiser l'application (i18n)", status: "TODO" },
    { title: "Intégrer la surveillance (monitoring)", status: "TODO" },
    { title: "Optimiser les images", status: "TODO" },
];
