"use server";

import { tag } from "@cache/api-utils";
import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums } from "@prisma/client/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { z } from "zod";
import { userOutputSchema } from "./user-schema";

const create = os
    .route({
        method: "POST",
        path: "/users",
        summary: "USER Create",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Create user with any role",
            "- **User**",
            "  - [ ] Cannot access this endpoint",
            "**Cache revalidation**",
            "  - [ ] Update specific tags after mutation",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            name: z.string().min(1, "Name is required").describe("Firstname"),
            lastname: z.string().optional().describe("Lastname"),
            email: z.string().describe("Email address"),
            image: z.string().optional().describe("Profile image URL"),
            role: z.enum($Enums.Role).optional().describe("User role: ADMIN, USER (default)"),
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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

        // Update cache
        updateTag(tag("user", "findMany"));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();

const update = os
    .route({
        method: "PUT",
        path: "/users/{id}",
        summary: "USER Update",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Update user of any user",
            "  - [ ] Can change role",
            "- **User**",
            "  - [ ] Update its own user only",
            "  - [ ] Cannot change role",
            "**Cache revalidation**",
            "  - [ ] Update specific tags after mutation",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
            name: z.string().min(1, "Name is required").optional().describe("Firstname"),
            lastname: z.string().nullable().optional().describe("Lastname"),
            image: z.string().nullable().optional().describe("Profile image URL"),
            role: z.enum($Enums.Role).optional().describe("User role: ADMIN, USER"),
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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

        // Update cache
        updateTag(tag("user", "findMany"));
        updateTag(tag("user", "findMany", userExists.id));
        updateTag(tag("user", "findUnique", input.id));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();

const deleting = os
    .route({
        method: "DELETE",
        path: "/users/{id}",
        summary: "USER Delete",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Delete user of any user",
            "  - [ ] Cannot delete himself",
            "- **User**",
            "  - [ ] Cannot access this endpoint",
            "**Cache revalidation**",
            "  - [ ] Update specific tags after mutation",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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

        // Update cache
        updateTag(tag("user", "findMany"));
        updateTag(tag("user", "findMany", userExists.id));
        updateTag(tag("user", "findUnique", input.id));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();

const userMutations = async () => ({
    create,
    update,
    delete: deleting,
});

export default userMutations;
