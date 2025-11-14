import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

const fruitFindManyCached = async (props: Prisma.FruitFindManyArgs, tags: string[]) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.fruit.findMany(props);
};

const fruitFindUniqueCached = async <T extends Prisma.FruitFindUniqueArgs>(
    props: Prisma.SelectSubset<T, Prisma.FruitFindUniqueArgs>,
    tags: string[],
) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.fruit.findUnique(props);
};

export { fruitFindManyCached, fruitFindUniqueCached };
