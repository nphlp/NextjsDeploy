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

export { fruitFindManyCached };
