import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

const taskFindManyCached = async (props: Prisma.TaskFindManyArgs, tags: string[]) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.task.findMany(props);
};

const taskFindUniqueCached = async (props: Prisma.TaskFindUniqueArgs, tags: string[]) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.task.findUnique(props);
};

const taskFindFirstCached = async (props: Prisma.TaskFindFirstArgs, tags: string[]) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.task.findFirst(props);
};

export { taskFindManyCached, taskFindUniqueCached, taskFindFirstCached };
