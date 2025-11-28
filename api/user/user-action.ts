"use server";

import { tag } from "@cache/api-utils";
import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import { userCreateInputSchema, userDeleteInputSchema, userOutputSchema, userUpdateInputSchema } from "./user-schema";

export const userCreate = os
    .input(userCreateInputSchema)
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
        revalidateTag(tag("user", "findMany"), { expire: 0 });

        // Provided invalidation
        input.updateTags?.map((t) => revalidateTag(t, { expire: 0 }));
        // Provided revalidation with stale
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        // Provided path refresh
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();

export const userUpdate = os
    .input(userUpdateInputSchema)
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
        revalidateTag(tag("user", "findMany"), { expire: 0 });
        revalidateTag(tag("user", "findMany", userExists.id), { expire: 0 });
        revalidateTag(tag("user", "findUnique", input.id), { expire: 0 });

        // Provided invalidation
        input.updateTags?.map((t) => revalidateTag(t, { expire: 0 }));
        // Provided revalidation with stale
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        // Provided path refresh
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();

export const userDeleting = os
    .input(userDeleteInputSchema)
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
        revalidateTag(tag("user", "findMany"), { expire: 0 });
        revalidateTag(tag("user", "findMany", userExists.id), { expire: 0 });
        revalidateTag(tag("user", "findUnique", input.id), { expire: 0 });

        // Provided invalidation
        input.updateTags?.map((t) => revalidateTag(t, { expire: 0 }));
        // Provided revalidation with stale
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        // Provided path refresh
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return user;
    })
    .actionable();
