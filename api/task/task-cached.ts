import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

const taskFindManyCached = async (props: Prisma.TaskFindManyArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findMany(props);
};

const taskFindUniqueCached = async (props: Prisma.TaskFindUniqueArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findUnique(props);
};

const taskFindFirstCached = async (props: Prisma.TaskFindFirstArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findFirst(props);
};

export { taskFindManyCached, taskFindUniqueCached, taskFindFirstCached };
