"use server";

import { UserUpdateAction } from "@actions/UserAction";
import { getSession } from "@lib/authServer";
import { ZodType, z } from "zod";

type UpdateLastnameActionProps = {
    lastname: string;
};

const UpdateLastnameSchema: ZodType<UpdateLastnameActionProps> = z.object({
    lastname: z.string(),
});

export const UpdateLastnameAction = async (props: UpdateLastnameActionProps): Promise<boolean> => {
    try {
        const { lastname } = UpdateLastnameSchema.parse(props);

        const session = await getSession();
        const userId = session?.user.id;

        if (!userId) throw new Error("User not authenticated");

        await UserUpdateAction({
            where: { id: userId },
            data: { lastname },
        });

        return true;
    } catch (error) {
        console.error("UpdateLastnameAction -> ", error);
        return false;
    }
};
