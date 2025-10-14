"use client";

import Button from "@comps/UI/button/button";
import { SessionClient, sendVerificationEmail, useSession } from "@lib/authClient";
import { CircleCheck, CircleX, Mail } from "lucide-react";
import { useState } from "react";

type ProfileInfoProps = {
    session: NonNullable<SessionClient>;
};

export default function ProfileInfo(props: ProfileInfoProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);

        const { data } = await sendVerificationEmail({
            email: session.user.email,
        });

        if (!data) {
            console.error("Error sending verification email");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-row items-center gap-5">
            {/* <ImageProfile
                imageBase64={session.user.image ?? null}
                name={session.user.name}
                className="size-16"
                classTemplate="stroke-[1.2px]"
            /> */}
            <div className="flex w-full items-center justify-between gap-2">
                <div>
                    <div className="text-md text-gray-high font-bold">
                        <span>{session.user.name}</span>
                        <span> </span>
                        <span>{session.user.lastname}</span>
                    </div>
                    <div className="text-gray-middle line-clamp-1 flex flex-row items-center gap-2 text-sm">
                        <div>{session.user.email}</div>
                        <div>
                            {session.user.emailVerified ? (
                                <CircleCheck className="size-4 stroke-green-500" />
                            ) : (
                                <CircleX className="size-4 stroke-red-400" />
                            )}
                        </div>
                    </div>
                </div>
                {!session.user.emailVerified && (
                    <Button
                        label="Resend email"
                        variant="outline"
                        onClick={handleResend}
                        isLoading={isLoading}
                        className={{ button: "px-3 py-1", text: "flex flex-row items-center gap-2" }}
                    >
                        <span>Resend</span>
                        <Mail className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
