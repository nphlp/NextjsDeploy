"use server";

import { Session, getSession } from "@lib/authServer";
import PrismaInstance from "@lib/prisma";
import { unauthorized } from "next/navigation";
import { ZodType, z } from "zod";
import { ActionResponse } from "./ActionError";

type UserUpdateActionProps = {
    lastname: string;
};

const updateUserActionSchema: ZodType<UserUpdateActionProps> = z.object({
    lastname: z.string(),
});

type UserUpdateActionResponse = ActionResponse<NonNullable<Session>["user"]>;

export const UserUpdateAction = async (props: UserUpdateActionProps): Promise<UserUpdateActionResponse> => {
    try {
        // Validate input
        const { lastname } = updateUserActionSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized(); // Not logged in

        // Check permission / role / ownership
        const userId = session.user.id;

        // Check related existencies in database
        const userExists = await PrismaInstance.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) throw new Error("User not found");

        // Some other logic here

        // Proceed to action
        await PrismaInstance.user.update({
            data: { lastname },
            where: { id: userId },
        });

        // Revalidate related cache tags

        return { data: session.user };
    } catch (error) {
        const expliciteErrorMessage = (error as Error).message;

        // Server logging
        console.error("UserUpdateAction -> ", expliciteErrorMessage, "\n\nRaw error:\n\n", error);

        // Client logging
        const isDev = process.env.NODE_ENV === "development";
        return { error: isDev ? expliciteErrorMessage : "Something went wrong" };
    }
};
