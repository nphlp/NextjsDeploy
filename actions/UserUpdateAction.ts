"use server";

import { Session, getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { unauthorized } from "next/navigation";
import { ZodType, z } from "zod";
import { ActionError, ActionResponse, ClientError } from "./ActionError";

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
        if (!userExists) throw new ClientError("User not found");

        // Some other logic here

        // Proceed to action
        await PrismaInstance.user.update({
            data: { lastname },
            where: { id: userId },
        });

        // Revalidate related cache tags

        return { data: session.user };
    } catch (error) {
        return ActionError(error);
    }
};
