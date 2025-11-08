import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums, Prisma, User } from "@prisma/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { ZodType, z } from "zod";

const userOutputSchema: ZodType<User> = z.object({
    id: z.string().describe("Unique ID of the user (nanoid)"),
    name: z.string().describe("Firstname of the user"),
    lastname: z.string().nullable().describe("Lastname of the user"),
    email: z.string().describe("Email address"),
    emailVerified: z.boolean().describe("Email verification status (boolean)"),
    image: z.string().nullable().describe("Profile image URL"),
    role: z.enum($Enums.Role).describe("User role: ADMIN, USER (default)"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

const getUserListFindMany = async (props: Prisma.UserFindManyArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.user.findMany(props);
};

const getUserList = os
    .route({
        method: "GET",
        path: "/users",
        summary: "Get users",
        description: formatStringArrayLineByLine([
            "**Pagination**",
            "  - [ ] Take: Number of tasks to take (min: 1, max: 1000)",
            "  - [ ] Skip: Number of tasks to skip (min: 0)",
            "\n",
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Get every users",
            "- **User**",
            "  - [ ] Cannot access this endpoint",
        ]),
    })
    .input(
        z
            .object({
                take: z.number().min(1).max(1000).optional().describe("Number of tasks to take"),
                skip: z.number().min(0).optional().describe("Number of tasks to skip"),
            })
            .optional(),
    )
    .output(z.array(userOutputSchema))
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        // Only admin can get user list
        const isAdmin = session.user.role === "ADMIN";
        if (!isAdmin) unauthorized();

        // Get user list
        const users = await getUserListFindMany(
            {
                take: input?.take,
                skip: input?.skip,
            },
            [`getUserList`],
        );

        return users;
    });

const getUserFindUnique = async (props: Prisma.UserFindUniqueArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.user.findUnique(props);
};

const getUser = os
    .route({
        method: "GET",
        path: "/users/{id}",
        summary: "Get a user by ID",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Get user of any user",
            "- **User**",
            "  - [ ] Get its own user only",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
        }),
    )
    .output(userOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if user exists (cached)
        const user = await getUserFindUnique({ where: { id: input.id } }, [`getUser-${input.id}`]);
        if (!user) notFound();

        // Check if user session is authorized to access this user
        const isAuthorized = isAdmin || user.id === session.user.id;
        if (!isAuthorized) unauthorized();

        return user;
    });

const createUser = os
    .route({
        method: "POST",
        path: "/users",
        summary: "Create a new user",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Create user with any role",
            "- **User**",
            "  - [ ] Cannot access this endpoint",
        ]),
    })
    .input(
        z.object({
            name: z.string().min(1, "Name is required").describe("Firstname"),
            lastname: z.string().optional().describe("Lastname"),
            email: z.string().describe("Email address"),
            image: z.string().optional().describe("Profile image URL"),
            role: z.enum($Enums.Role).optional().describe("User role: ADMIN, USER (default)"),
        }),
    )
    .output(userOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        // Only admin can create users manually
        // End users should sign up through the sign up flow
        const isAdmin = session.user.role === "ADMIN";
        if (!isAdmin) unauthorized();

        // Check if email is already used
        const existingUser = await PrismaInstance.user.findUnique({ where: { email: input.email } });
        if (existingUser) throw new Error("Email already exists");

        // Create the user
        const user = await PrismaInstance.user.create({
            data: {
                name: input.name,
                lastname: input.lastname,
                email: input.email,
                emailVerified: false,
                image: input.image,
                role: input.role,
            },
        });

        // Revalidate cache
        revalidateTag(`getUserList`, "hours");

        return user;
    });

const updateUser = os
    .route({
        method: "PUT",
        path: "/users/{id}",
        summary: "Update a user",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Update user of any user",
            "  - [ ] Can change role",
            "- **User**",
            "  - [ ] Update its own user only",
            "  - [ ] Cannot change role",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
            name: z.string().min(1, "Name is required").optional().describe("Firstname"),
            lastname: z.string().nullable().optional().describe("Lastname"),
            image: z.string().nullable().optional().describe("Profile image URL"),
            role: z.enum($Enums.Role).optional().describe("User role: ADMIN, USER"),
        }),
    )
    .output(userOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if user exists
        const userExists = await PrismaInstance.user.findUnique({ where: { id: input.id } });
        if (!userExists) notFound();

        // Check if user session is authorized to mutate this user
        const isAuthorized = isAdmin || userExists.id === session.user.id;
        if (!isAuthorized) unauthorized();

        // Only admin can change roles
        if (input.role && !isAdmin) unauthorized();

        // Update the user
        const user = await PrismaInstance.user.update({
            data: {
                name: input.name,
                lastname: input.lastname,
                image: input.image,
                role: input.role,
            },
            where: { id: input.id },
        });

        // Revalidate cache
        revalidateTag(`getUserList`, "hours");
        revalidateTag(`getUserList-${userExists.id}`, "hours");
        revalidateTag(`getUser-${input.id}`, "hours");

        return user;
    });

const deleteUser = os
    .route({
        method: "DELETE",
        path: "/users/{id}",
        summary: "Delete a user",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Delete user of any user",
            "  - [ ] Cannot delete himself",
            "- **User**",
            "  - [ ] Cannot access this endpoint",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
        }),
    )
    .output(userOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        // Only admin can delete users
        const isAdmin = session.user.role === "ADMIN";
        if (!isAdmin) unauthorized();

        // Prevent admin from deleting themselves
        if (session.user.id === input.id) unauthorized();

        // Check if user exists
        const userExists = await PrismaInstance.user.findUnique({ where: { id: input.id } });
        if (!userExists) notFound();

        // Delete the user
        const user = await PrismaInstance.user.delete({ where: { id: input.id } });

        // Revalidate cache
        revalidateTag(`getUserList`, "hours");
        revalidateTag(`getUserList-${userExists.id}`, "hours");
        revalidateTag(`getUser-${input.id}`, "hours");

        return user;
    });

export const userRoutes = {
    list: getUserList,
    get: getUser,
    create: createUser,
    update: updateUser,
    delete: deleteUser,
};
