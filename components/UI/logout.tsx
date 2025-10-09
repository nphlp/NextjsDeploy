"use client";

import Button from "@comps/UI/button/button";
import { signOut } from "@lib/authClient";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { ButtonVariant } from "./button/theme";

type LogoutProps = {
    variant?: ButtonVariant;
    children: ReactNode;
};

export default function Logout(props: LogoutProps) {
    const { variant, children } = props;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            router.push("/");
        } else {
            throw new Error("Something went wrong...");
        }
    };

    return (
        <Button
            label="Se déconnecter"
            className={{ text: "flex items-center gap-2" }}
            onClick={handleClick}
            variant={variant}
            isLoading={isLoading}
        >
            {children}
        </Button>
    );
}
