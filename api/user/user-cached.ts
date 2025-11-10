import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

const userFindManyCached = async (props: Prisma.UserFindManyArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.user.findMany(props);
};

const userFindUniqueCached = async (props: Prisma.UserFindUniqueArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.user.findUnique(props);
};

const userFindFirstCached = async (props: Prisma.UserFindFirstArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.user.findFirst(props);
};

export { userFindManyCached, userFindUniqueCached, userFindFirstCached };
