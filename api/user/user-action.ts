"use server";

import SendEmailAction from "@actions/send-email";
import EmailTemplate from "@comps/email-template";
import { NEXT_PUBLIC_BASE_URL } from "@lib/env";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import { tag } from "@/api/cache";
import { requiresSession } from "../permission";
import {
    userCancelPendingEmailInputSchema,
    userCreateInputSchema,
    userDeleteInputSchema,
    userOutputSchema,
    userSetPendingEmailInputSchema,
    userUpdateInputSchema,
} from "./user-schema";

export const userCreate = os
    .input(userCreateInputSchema)
    .output(userOutputSchema)
    .use(requiresSession)
    .handler(async ({ input, context }) => {
        const { isAdmin } = context;

        // Only admin can create users manually
        // End users should sign up through the sign up flow
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
    .use(requiresSession)
    .handler(async ({ input, context }) => {
        const { isAdmin, isOwnerOrAdmin } = context;

        // Check if user exists
        const userExists = await PrismaInstance.user.findUnique({ where: { id: input.id } });
        if (!userExists) notFound();

        // Check if user session is authorized to mutate this user
        if (!isOwnerOrAdmin(userExists.id)) unauthorized();

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
    .use(requiresSession)
    .handler(async ({ input, context }) => {
        const { session, isAdmin } = context;

        // Only admin can delete users
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

export const userSetPendingEmail = os
    .input(userSetPendingEmailInputSchema)
    .output(userOutputSchema)
    .use(requiresSession)
    .handler(async ({ input, context }) => {
        const { session } = context;

        const user = await PrismaInstance.user.update({
            where: { id: session.user.id },
            data: { pendingEmail: input.newEmail },
        });

        // Notify old email that a change was requested
        void SendEmailAction({
            subject: "Changement d\u2019email en cours",
            email: session.user.email,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
                emailType: "change-requested",
            }),
        });

        return user;
    })
    .actionable();

export const userCancelPendingEmail = os
    .input(userCancelPendingEmailInputSchema)
    .output(userOutputSchema)
    .use(requiresSession)
    .handler(async ({ context }) => {
        const { session } = context;

        const user = await PrismaInstance.user.update({
            where: { id: session.user.id },
            data: { pendingEmail: null },
        });

        // Notify user that the change was canceled
        void SendEmailAction({
            subject: "Changement d\u2019email annulé",
            email: session.user.email,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
                emailType: "change-canceled",
            }),
        });

        return user;
    })
    .actionable();
